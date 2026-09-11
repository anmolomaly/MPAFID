import pandas as pd
from sentence_transformers import SentenceTransformer


# Load training data
data = pd.read_csv("data/training_pairs.csv")

print("Training data loaded!")
print(data.head())


# Load the pre-trained MiniLM model
model = SentenceTransformer("all-MiniLM-L6-v2")

print("MiniLM model loaded successfully!")


# Create embeddings for the first sentence
sentence1_embeddings = model.encode(
    data["sentence1"].tolist(),
    show_progress_bar=True
)

# Create embeddings for the second sentence
sentence2_embeddings = model.encode(
    data["sentence2"].tolist(),
    show_progress_bar=True
)


print("\nEmbedding creation completed!")

print("Number of sentence pairs:", len(data))

print(
    "Embedding size:",
    sentence1_embeddings.shape[1]
)


# Save embeddings
import numpy as np

np.save(
    "models/sentence1_embeddings.npy",
    sentence1_embeddings
)

np.save(
    "models/sentence2_embeddings.npy",
    sentence2_embeddings
)


print("\nEmbeddings saved inside the models folder.")

print("\nAI model preparation completed!")