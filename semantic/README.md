# e-Sakshi Semantic Deduplication & NLP

AI/ML system for detecting duplicate or highly similar government project proposals.

## Technologies

- Python
- Streamlit
- Sentence Transformers
- MiniLM
- FAISS
- Pandas
- NumPy
- Scikit-learn
- PyTorch

## How it works

1. A new government project proposal is entered.
2. The proposal is converted into an AI semantic embedding.
3. FAISS searches existing project embeddings.
4. Projects within a specified geographical radius are considered.
5. Cosine similarity is calculated.
6. The system identifies possible duplicate projects.
7. A similarity score and risk level are displayed.

## Geospatial Filtering

The system uses latitude and longitude to calculate the distance between projects.

The default search radius is 5 km.

## Risk Levels

- HIGH: similarity >= 85%
- MEDIUM: similarity >= configured threshold
- LOW: similarity below the configured threshold

## Project Structure

```text
eSakshi_Semantic_Deduplication
│
├── data
│   ├── projects.csv
│   └── training_pairs.csv
│
├── models
├── faiss_db
├── logs
├── venv
│
├── app.py
├── dedup_engine.py
├── train_model.py
├── requirements.txt
├── README.md
└── .gitignore
