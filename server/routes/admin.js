import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Job from '../models/Job.js';
import Application from '../models/Application.js';
import CandidateReview from '../models/CandidateReview.js';

const router = express.Router();

const auth = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    next();
};

router.get('/stats', auth, isAdmin, async (req, res) => {
    try {
        const [users, jobs, reviews, applications] = await Promise.all([
            User.find().select('-password'),
            Job.find(),
            CandidateReview.find(),
            Application.find().select('status'),
        ]);

        const byRole = users.reduce((acc, u) => {
            acc[u.role] = (acc[u.role] || 0) + 1;
            return acc;
        }, {});

        const jobsByStatus = jobs.reduce((acc, j) => {
            acc[j.status] = (acc[j.status] || 0) + 1;
            return acc;
        }, {});

        const avgScore = reviews.length
            ? (reviews.reduce((s, r) => s + (r.aiScore || 0), 0) / reviews.length).toFixed(2)
            : 0;

        const totalPoints = users.reduce((s, u) => s + (u.points || 0), 0);

        res.json({
            users: {
                total: users.length,
                byRole,
                recent: users
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .slice(0, 6)
                    .map(u => ({ id: u._id, name: u.name, email: u.email, role: u.role, createdAt: u.createdAt })),
            },
            jobs: {
                total: jobs.length,
                byStatus: jobsByStatus,
                recent: jobs
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .slice(0, 6)
                    .map(j => ({ id: j._id, title: j.title, company: j.company, status: j.status, createdAt: j.createdAt })),
            },
            reviews: {
                total: reviews.length,
                avgScore: Number(avgScore),
                recent: reviews
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .slice(0, 6)
                    .map(r => ({ id: r._id, candidateName: r.candidateName, jobTitle: r.jobTitle, aiScore: r.aiScore, createdAt: r.createdAt })),
            },
            applications: {
                total: applications.length,
                byStatus: applications.reduce((acc, application) => {
                    acc[application.status] = (acc[application.status] || 0) + 1;
                    return acc;
                }, {}),
            },
            totalPoints,
        });
    } catch (error) {
        console.error('Admin stats error:', error);
        res.status(500).json({ message: 'Server error fetching stats' });
    }
});

// GET /api/admin/users
router.get('/users', auth, isAdmin, async (req, res) => {
    try {
        const { search = '', role = 'all', page = 1, limit = 20, sort = 'newest' } = req.query;
        const q = {};
        if (role && role !== 'all') q.role = role;
        if (search) {
            q.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
            ];
        }

        const sortMap = {
            newest: { createdAt: -1 },
            oldest: { createdAt: 1 },
            name: { name: 1 },
            points: { points: -1 },
        };

        const skip = (Number(page) - 1) * Number(limit);
        const [users, total] = await Promise.all([
            User.find(q).select('-password').sort(sortMap[sort] || sortMap.newest).skip(skip).limit(Number(limit)),
            User.countDocuments(q),
        ]);

        res.json({
            users,
            total,
            page: Number(page),
            pages: Math.ceil(total / Number(limit)),
        });
    } catch (error) {
        console.error('Admin users error:', error);
        res.status(500).json({ message: 'Server error fetching users' });
    }
});

// PATCH /api/admin/users/:id/role
router.patch('/users/:id/role', auth, isAdmin, async (req, res) => {
    try {
        const { role } = req.body;
        if (!['candidate', 'hr', 'admin'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role' });
        }
        if (String(req.user.userId) === String(req.params.id)) {
            return res.status(400).json({ message: 'You cannot change your own role' });
        }
        const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        console.error('Admin update role error:', error);
        res.status(500).json({ message: 'Server error updating role' });
    }
});

// PATCH /api/admin/users/:id/approve  (approve or reject a pending user)
router.patch('/users/:id/approve', auth, isAdmin, async (req, res) => {
    try {
        const { approved, role } = req.body;
        const update = {};
        if (typeof approved === 'boolean') update.isApproved = approved;
        if (role && ['candidate', 'hr', 'admin'].includes(role)) update.role = role;
        const user = await User.findByIdAndUpdate(req.params.id, update, { new: true }).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        console.error('Admin approve user error:', error);
        res.status(500).json({ message: 'Server error updating user approval' });
    }
});

// PATCH /api/admin/users/:id/points
router.patch('/users/:id/points', auth, isAdmin, async (req, res) => {
    try {
        const { points } = req.body;
        if (typeof points !== 'number' || points < 0) {
            return res.status(400).json({ message: 'Points must be a non-negative number' });
        }
        const user = await User.findByIdAndUpdate(req.params.id, { points }, { new: true }).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        console.error('Admin update points error:', error);
        res.status(500).json({ message: 'Server error updating points' });
    }
});

// DELETE /api/admin/users/:id
router.delete('/users/:id', auth, isAdmin, async (req, res) => {
    try {
        if (String(req.user.userId) === String(req.params.id)) {
            return res.status(400).json({ message: 'You cannot delete your own account' });
        }
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        const ownedJobIds = await Job.find({ hrRef: req.params.id }).distinct('_id');
        await Promise.all([
            Application.deleteMany({ $or: [{ candidateId: req.params.id }, { jobId: { $in: ownedJobIds } }] }),
            CandidateReview.deleteMany({ $or: [{ candidateId: req.params.id }, { hrId: req.params.id }] }),
            Job.deleteMany({ hrRef: req.params.id }),
            User.deleteOne({ _id: req.params.id }),
        ]);

        res.json({ message: 'User and related data deleted' });
    } catch (error) {
        console.error('Admin delete user error:', error);
        res.status(500).json({ message: 'Server error deleting user' });
    }
});
// GET /api/admin/jobs
router.get('/jobs', auth, isAdmin, async (req, res) => {
    try {
        const { search = '', status = 'all', page = 1, limit = 20 } = req.query;
        const q = {};
        if (status && status !== 'all') q.status = status;
        if (search) {
            q.$or = [
                { title: { $regex: search, $options: 'i' } },
                { company: { $regex: search, $options: 'i' } },
            ];
        }

        const skip = (Number(page) - 1) * Number(limit);
        const [jobs, total] = await Promise.all([
            Job.find(q).populate('hrRef', 'name email role').sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
            Job.countDocuments(q),
        ]);

        res.json({ jobs, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
    } catch (error) {
        console.error('Admin jobs error:', error);
        res.status(500).json({ message: 'Server error fetching jobs' });
    }
});

router.get('/applications', auth, isAdmin, async (req, res) => {
    try {
        const { search = '', status = 'all' } = req.query;
        const query = {};
        if (status !== 'all') query.status = status;
        const applications = await Application.find(query)
            .populate('candidateId', 'name email phone skills')
            .populate({ path: 'jobId', select: 'title company status hrRef', populate: { path: 'hrRef', select: 'name email' } })
            .sort({ createdAt: -1 })
            .limit(250);
        const needle = String(search).trim().toLowerCase();
        const filtered = needle ? applications.filter((application) => {
            const fields = [application.candidateId?.name, application.candidateId?.email, application.jobId?.title, application.jobId?.company, application.jobId?.hrRef?.name];
            return fields.some((field) => String(field || '').toLowerCase().includes(needle));
        }) : applications;
        return res.json({ applications: filtered, total: filtered.length });
    } catch (error) {
        console.error('Admin applications error:', error.message);
        return res.status(500).json({ message: 'Could not load applications.' });
    }
});

router.patch('/applications/:id', auth, isAdmin, async (req, res) => {
    try {
        const { status, hrNote } = req.body || {};
        if (!['submitted', 'reviewing', 'interview', 'interviewed', 'accepted', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Select a valid application status.' });
        }
        const application = await Application.findByIdAndUpdate(req.params.id, {
            status,
            ...(typeof hrNote === 'string' ? { hrNote: hrNote.trim().slice(0, 2000) } : {}),
        }, { new: true })
            .populate('candidateId', 'name email phone skills')
            .populate({ path: 'jobId', select: 'title company status hrRef', populate: { path: 'hrRef', select: 'name email' } });
        if (!application) return res.status(404).json({ message: 'Application not found.' });
        return res.json(application);
    } catch (error) {
        console.error('Admin update application error:', error.message);
        return res.status(500).json({ message: 'Could not update application.' });
    }
});

// PATCH /api/admin/jobs/:id/status
router.patch('/jobs/:id/status', auth, isAdmin, async (req, res) => {
    try {
        const { status } = req.body;
        if (!['open', 'closed'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }
        const job = await Job.findByIdAndUpdate(req.params.id, { status }, { new: true }).populate('hrRef', 'name email role');
        if (!job) return res.status(404).json({ message: 'Job not found' });
        res.json(job);
    } catch (error) {
        console.error('Admin update job status error:', error);
        res.status(500).json({ message: 'Server error updating job' });
    }
});

// DELETE /api/admin/jobs/:id
router.delete('/jobs/:id', auth, isAdmin, async (req, res) => {
    try {
        const job = await Job.findByIdAndDelete(req.params.id);
        if (!job) return res.status(404).json({ message: 'Job not found' });
        await Promise.all([CandidateReview.deleteMany({ jobId: req.params.id }), Application.deleteMany({ jobId: req.params.id })]);
        res.json({ message: 'Job and related applications deleted' });
    } catch (error) {
        console.error('Admin delete job error:', error);
        res.status(500).json({ message: 'Server error deleting job' });
    }
});

// GET /api/admin/reviews
router.get('/reviews', auth, isAdmin, async (req, res) => {
    try {
        const { search = '', page = 1, limit = 20 } = req.query;
        const q = {};
        if (search) {
            q.$or = [
                { candidateName: { $regex: search, $options: 'i' } },
                { jobTitle: { $regex: search, $options: 'i' } },
            ];
        }

        const skip = (Number(page) - 1) * Number(limit);
        const [reviews, total] = await Promise.all([
            CandidateReview.find(q)
                .populate('candidateId', 'name email role')
                .populate('hrId', 'name email role')
                .populate('jobId', 'title company status')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(Number(limit)),
            CandidateReview.countDocuments(q),
        ]);

        res.json({ reviews, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
    } catch (error) {
        console.error('Admin reviews error:', error);
        res.status(500).json({ message: 'Server error fetching reviews' });
    }
});

// GET /api/admin/reviews/:id
router.get('/reviews/:id', auth, isAdmin, async (req, res) => {
    try {
        const review = await CandidateReview.findById(req.params.id)
            .populate('candidateId', 'name email role')
            .populate('hrId', 'name email role')
            .populate('jobId', 'title company status');
        if (!review) return res.status(404).json({ message: 'Review not found' });
        res.json(review);
    } catch (error) {
        console.error('Admin review detail error:', error);
        res.status(500).json({ message: 'Server error fetching review' });
    }
});

router.patch('/reviews/:id/approval', auth, isAdmin, async (req, res) => {
    try {
        const { status } = req.body || {};
        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Review status must be approved or rejected.' });
        }
        const review = await CandidateReview.findByIdAndUpdate(
            req.params.id,
            { status, approvedAt: status === 'approved' ? new Date() : null },
            { new: true, runValidators: true },
        )
            .populate('candidateId', 'name email role')
            .populate('hrId', 'name email role')
            .populate('jobId', 'title company status');
        if (!review) return res.status(404).json({ message: 'Review not found.' });
        return res.json(review);
    } catch (error) {
        console.error('Admin review approval failed:', error.message);
        return res.status(500).json({ message: 'Could not update review approval.' });
    }
});

// DELETE /api/admin/reviews/:id
router.delete('/reviews/:id', auth, isAdmin, async (req, res) => {
    try {
        const review = await CandidateReview.findByIdAndDelete(req.params.id);
        if (!review) return res.status(404).json({ message: 'Review not found' });
        res.json({ message: 'Review deleted' });
    } catch (error) {
        console.error('Admin delete review error:', error);
        res.status(500).json({ message: 'Server error deleting review' });
    }
});

// GET /api/admin/analytics
router.get('/analytics', auth, isAdmin, async (req, res) => {
    try {
        const [users, jobs, reviews] = await Promise.all([
            User.find().select('role createdAt points'),
            Job.find().select('status createdAt'),
            CandidateReview.find().select('aiScore createdAt jobTitle'),
        ]);

        const days = 14;
        const now = new Date();
        const growth = [];
        for (let i = days - 1; i >= 0; i--) {
            const d = new Date(now);
            d.setDate(d.getDate() - i);
            const key = d.toISOString().slice(0, 10);
            const count = users.filter(u => u.createdAt && u.createdAt.toISOString().slice(0, 10) === key).length;
            growth.push({ date: key, count });
        }

        const buckets = [0, 0, 0, 0, 0, 0];
        reviews.forEach(r => {
            const b = Math.min(5, Math.max(0, Math.round((r.aiScore || 0) / 20)));
            buckets[b]++;
        });

        const byJob = {};
        reviews.forEach(r => {
            if (!byJob[r.jobTitle]) byJob[r.jobTitle] = { total: 0, count: 0 };
            byJob[r.jobTitle].total += r.aiScore || 0;
            byJob[r.jobTitle].count += 1;
        });
        const jobScores = Object.entries(byJob)
            .map(([title, v]) => ({ title, avg: (v.total / v.count / 20).toFixed(2), count: v.count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 8);

        res.json({
            userGrowth: growth,
            roleDistribution: users.reduce((acc, u) => { acc[u.role] = (acc[u.role] || 0) + 1; return acc; }, {}),
            jobStatus: jobs.reduce((acc, j) => { acc[j.status] = (acc[j.status] || 0) + 1; return acc; }, {}),
            scoreDistribution: buckets.map((c, i) => ({ score: i, count: c })),
            jobScores,
            totals: {
                users: users.length,
                jobs: jobs.length,
                reviews: reviews.length,
                points: users.reduce((s, u) => s + (u.points || 0), 0),
            },
        });
    } catch (error) {
        console.error('Admin analytics error:', error);
        res.status(500).json({ message: 'Server error fetching analytics' });
    }
});

export default router;
