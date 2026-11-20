import json, platform, shutil, subprocess, sys

def main():
    info = {
        "os": platform.system(),
        "os_release": platform.release(),
        "python": sys.version,
        "machine": platform.machine(),
        "cpu_count": __import__("os").cpu_count(),
        "ram_gb": None,
        "disk_free_gb": None,
        "cuda_available": False,
        "gpu": None,
        "gpu_vram_gb": None,
    }
    try:
        import psutil
        info["ram_gb"] = round(psutil.virtual_memory().total / (1024**3), 2)
    except Exception:
        pass
    try:
        usage = shutil.disk_usage(".")
        info["disk_free_gb"] = round(usage.free / (1024**3), 2)
    except Exception:
        pass
    try:
        import torch
        info["cuda_available"] = bool(torch.cuda.is_available())
        if info["cuda_available"]:
            info["gpu"] = torch.cuda.get_device_name(0)
            info["gpu_vram_gb"] = round(torch.cuda.get_device_properties(0).total_memory / (1024**3), 2)
    except Exception as e:
        info["torch_error"] = str(e)
    print(json.dumps(info, indent=2))

if __name__ == "__main__":
    main()
