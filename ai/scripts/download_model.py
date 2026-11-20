import argparse, json, os, yaml
from huggingface_hub import snapshot_download

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--config", default="ai/config/model.yaml")
    parser.add_argument("--model", default=None)
    args = parser.parse_args()

    with open(args.config) as f:
        cfg = yaml.safe_load(f)
    model_id = args.model or cfg["model"]["id"]
    local_dir = cfg["model"]["local_dir"]
    os.makedirs(local_dir, exist_ok=True)

    print(f"Downloading {model_id} into {local_dir} ...")
    path = snapshot_download(repo_id=model_id, local_dir=local_dir, local_dir_use_symlinks=False)
    manifest = {
        "model_id": model_id,
        "local_dir": local_dir,
        "downloaded_path": path,
        "license": cfg["model"].get("license"),
    }
    with open(os.path.join(local_dir, "manifest.json"), "w") as f:
        json.dump(manifest, f, indent=2)
    print("Download complete. Manifest written.")

if __name__ == "__main__":
    main()
