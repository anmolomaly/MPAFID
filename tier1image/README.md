# MPAFID Tier 1 Image Verification

## Easiest Windows + VS Code setup

1. Open this folder in VS Code.
2. Open **Terminal -> New Terminal**.
3. Run:

```powershell
.\run_windows.bat
```

4. Open:

http://127.0.0.1:8000/docs

5. Use `POST /api/v1/verify-milestone` -> **Try it out** -> upload an image -> enter project ID, target latitude and target longitude -> **Execute**.

## Manual commands

```powershell
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn mpafid_verifier:app --reload
```

## Self test

```powershell
.venv\Scripts\python.exe mpafid_verifier.py
```

## Generated files

- `mpafid_hash_registry.sqlite3`: duplicate/hash registry
- `static/ela/`: ELA heatmap artifacts
