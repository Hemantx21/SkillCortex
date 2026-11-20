import express from 'express';
import jwt from 'jsonwebtoken';
import Job from '../models/Job.js';
import Application from '../models/Application.js';
import CandidateReview from '../models/CandidateReview.js';

const router = express.Router();
const APPLICATION_STATUSES = ['submitted', 'reviewing', 'interview', 'interviewed', 'accepted', 'rejected'];

function auth(req, res, next) {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Sign in to continue.' });
    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        next();
    } catch {
        return res.status(401).json({ message: 'Your session is invalid. Sign in again.' });
    }
}

const requireRole = (role) => (req, res, next) => {
    if (req.user.role !== role) return res.status(403).json({ message: `${role} access required.` });
    next();
};

function normalizeRequirements(requirements) {
    if (Array.isArray(requirements)) return requirements.map((item) => String(item).trim()).filter(Boolean);
    if (typeof requirements === 'string') return requirements.split(',').map((item) => item.trim()).filter(Boolean);
    return [];
}

function handleInvalidId(error, res) {
    if (error?.name === 'CastError' || error?.kind === 'ObjectId') {
        res.status(404).json({ message: 'Record not found.' });
        return true;
    }
    return false;
}

router.get('/', async (_req, res) => {
    try {
        const jobs = await Job.find({ status: 'open' }).sort({ createdAt: -1 });
        return res.json(jobs);
    } catch (error) {
        console.error('List jobs failed:', error.message);
        return res.status(500).json({ message: 'Could not load jobs.' });
    }
});

router.post('/', auth, requireRole('hr'), async (req, res) => {
    try {
        const { title, company, description, requirements, location, salary } = req.body || {};
        if (![title, company, description].every((value) => typeof value === 'string' && value.trim())) {
            return res.status(400).json({ message: 'Job title, company, and description are required.' });
        }
        const job = await Job.create({
            title: title.trim().slice(0, 160),
            company: company.trim().slice(0, 160),
            description: description.trim().slice(0, 12000),
            requirements: normalizeRequirements(requirements).slice(0, 40),
            location: typeof location === 'string' ? location.trim().slice(0, 160) : '',
            salary: typeof salary === 'string' ? salary.trim().slice(0, 100) : '',
            hrRef: req.user.userId,
        });
        return res.status(201).json(job);
    } catch (error) {
        console.error('Create job failed:', error.message);
        return res.status(500).json({ message: 'Could not create job.' });
    }
});

router.get('/hr/jobs', auth, requireRole('hr'), async (req, res) => {
    try {
        const jobs = await Job.find({ hrRef: req.user.userId }).sort({ createdAt: -1 });
        const counts = await Application.aggregate([
            { $match: { jobId: { $in: jobs.map((job) => job._id) } } },
            { $group: { _id: '$jobId', count: { $sum: 1 } } },
        ]);
        const countByJob = new Map(counts.map(({ _id, count }) => [String(_id), count]));
        return res.json(jobs.map((job) => ({ ...job.toObject(), applicationCount: countByJob.get(String(job._id)) || 0 })));
    } catch (error) {
        console.error('HR jobs failed:', error.message);
        return res.status(500).json({ message: 'Could not load your job postings.' });
    }
});

router.get('/hr/applications', auth, requireRole('hr'), async (req, res) => {
    try {
        const ownedJobs = await Job.find({ hrRef: req.user.userId }).select('_id');
        const jobIds = ownedJobs.map((job) => job._id);
        const applications = await Application.find({ jobId: { $in: jobIds } })
            .populate('candidateId', 'name email phone skills bio')
            .populate('jobId', 'title company status')
            .sort({ createdAt: -1 });
        return res.json(applications);
    } catch (error) {
        console.error('HR applications failed:', error.message);
        return res.status(500).json({ message: 'Could not load applications.' });
    }
});

router.get('/hr/reviews', auth, requireRole('hr'), async (req, res) => {
    try {
        const reviews = await CandidateReview.find({ hrId: req.user.userId, status: 'approved' })
            .populate('candidateId', 'name email')
            .populate('jobId', 'title company')
            .sort({ approvedAt: -1, createdAt: -1 });
        return res.json(reviews);
    } catch (error) {
        console.error('HR approved reviews failed:', error.message);
        return res.status(500).json({ message: 'Could not load approved interview scorecards.' });
    }
});

router.patch('/hr/applications/:applicationId', auth, requireRole('hr'), async (req, res) => {
    try {
        const { status, hrNote } = req.body || {};
        if (!APPLICATION_STATUSES.includes(status)) return res.status(400).json({ message: 'Select a valid application status.' });
        if (['interview', 'interviewed'].includes(status)) return res.status(403).json({ message: 'Only an admin can approve a candidate for an interview.' });
        const application = await Application.findById(req.params.applicationId).populate('jobId', 'hrRef title company status');
        if (!application) return res.status(404).json({ message: 'Application not found.' });
        if (String(application.jobId.hrRef) !== String(req.user.userId)) return res.status(403).json({ message: 'You can only review applications for your own job postings.' });
        application.status = status;
        if (typeof hrNote === 'string') application.hrNote = hrNote.trim().slice(0, 2000);
        await application.save();
        await application.populate('candidateId', 'name email phone skills bio');
        return res.json(application);
    } catch (error) {
        if (handleInvalidId(error, res)) return;
        console.error('Update application failed:', error.message);
        return res.status(500).json({ message: 'Could not update application.' });
    }
});

router.post('/:id/applications', auth, requireRole('candidate'), async (req, res) => {
    try {
        const resumeText = typeof req.body?.resumeText === 'string' ? req.body.resumeText.trim() : '';
        if (resumeText.length < 50) return res.status(400).json({ message: 'Add at least 50 characters of resume text before applying.' });
        if (resumeText.length > 12000) return res.status(400).json({ message: 'Resume text must be 12,000 characters or fewer.' });
        const job = await Job.findOne({ _id: req.params.id, status: 'open' });
        if (!job) return res.status(404).json({ message: 'This job is no longer accepting applications.' });
        const application = await Application.create({ jobId: job._id, candidateId: req.user.userId, resumeText });
        return res.status(201).json({ application, job });
    } catch (error) {
        if (error?.code === 11000) return res.status(409).json({ message: 'You have already applied to this job.' });
        if (handleInvalidId(error, res)) return;
        console.error('Apply to job failed:', error.message);
        return res.status(500).json({ message: 'Could not submit your application.' });
    }
});

router.get('/mine/applications', auth, requireRole('candidate'), async (req, res) => {
    try {
        const applications = await Application.find({ candidateId: req.user.userId })
            .populate('jobId', 'title company location salary status requirements description')
            .sort({ createdAt: -1 });
        return res.json(applications);
    } catch (error) {
        console.error('Candidate applications failed:', error.message);
        return res.status(500).json({ message: 'Could not load your applications.' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ message: 'Job not found.' });
        return res.json(job);
    } catch (error) {
        if (handleInvalidId(error, res)) return;
        console.error('Get job failed:', error.message);
        return res.status(500).json({ message: 'Could not load this job.' });
    }
});

router.patch('/:id/status', auth, async (req, res, next) => {
    if (!['hr', 'admin'].includes(req.user.role)) return res.status(403).json({ message: 'HR or admin access required.' });
    try {
        const { status } = req.body || {};
        if (!['open', 'closed'].includes(status)) return res.status(400).json({ message: 'Status must be open or closed.' });
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ message: 'Job not found.' });
        if (req.user.role === 'hr' && String(job.hrRef) !== String(req.user.userId)) return res.status(403).json({ message: 'You can only update your own job postings.' });
        job.status = status;
        await job.save();
        return res.json(job);
    } catch (error) {
        if (handleInvalidId(error, res)) return;
        console.error('Update job status failed:', error.message);
        return res.status(500).json({ message: 'Could not update job status.' });
    }
});

router.delete('/:id', auth, async (req, res, next) => {
    if (!['hr', 'admin'].includes(req.user.role)) return res.status(403).json({ message: 'HR or admin access required.' });
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ message: 'Job not found.' });
        if (req.user.role === 'hr' && String(job.hrRef) !== String(req.user.userId)) return res.status(403).json({ message: 'You can only delete your own job postings.' });
        await Promise.all([Job.deleteOne({ _id: job._id }), Application.deleteMany({ jobId: job._id }), CandidateReview.deleteMany({ jobId: job._id })]);
        return res.json({ message: 'Job and related applications removed.' });
    } catch (error) {
        if (handleInvalidId(error, res)) return;
        console.error('Delete job failed:', error.message);
        return res.status(500).json({ message: 'Could not delete job.' });
    }
});

export default router;
