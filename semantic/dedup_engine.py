import math
import pandas as pd
import numpy as np
import faiss
from sentence_transformers import SentenceTransformer


class SemanticDeduplicationEngine:

    def __init__(
        self,
        data_path="data/projects.csv",
        similarity_threshold=0.75,
        radius_km=5
    ):
        self.data_path = data_path
        self.similarity_threshold = similarity_threshold
        self.radius_km = radius_km

        print("Loading projects...")
        self.projects = pd.read_csv(self.data_path)

        print("Loading AI embedding model...")
        self.model = SentenceTransformer("all-MiniLM-L6-v2")

        self.index = None
        self.embeddings = None

        self.build_index()

    # ---------------------------------------------------------
    # Create searchable text for every government project
    # ---------------------------------------------------------
    def create_project_text(self, row):

        return (
            f"Project Title: {row['title']}. "
            f"Description: {row['description']}. "
            f"Category: {row['category']}. "
            f"Constituency: {row['constituency']}."
        )

    # ---------------------------------------------------------
    # Create FAISS vector database
    # ---------------------------------------------------------
    def build_index(self):

        texts = self.projects.apply(
            self.create_project_text,
            axis=1
        ).tolist()

        print("Creating embeddings...")

        self.embeddings = self.model.encode(
            texts,
            convert_to_numpy=True,
            show_progress_bar=True
        )

        # Normalize vectors so inner product = cosine similarity
        faiss.normalize_L2(self.embeddings)

        dimension = self.embeddings.shape[1]

        self.index = faiss.IndexFlatIP(dimension)

        self.index.add(self.embeddings)

        print(f"FAISS index created with {len(texts)} projects.")

    # ---------------------------------------------------------
    # Convert latitude/longitude distance into kilometers
    # ---------------------------------------------------------
    def haversine_distance(
        self,
        lat1,
        lon1,
        lat2,
        lon2
    ):

        earth_radius = 6371.0

        lat1 = math.radians(lat1)
        lat2 = math.radians(lat2)

        delta_lat = math.radians(lat2 - lat1)
        delta_lon = math.radians(lon2 - lon1)

        a = (
            math.sin(delta_lat / 2) ** 2
            +
            math.cos(lat1)
            * math.cos(lat2)
            * math.sin(delta_lon / 2) ** 2
        )

        c = 2 * math.atan2(
            math.sqrt(a),
            math.sqrt(1 - a)
        )

        return earth_radius * c

    # ---------------------------------------------------------
    # Search for possible duplicate projects
    # ---------------------------------------------------------
    def check_duplicate(
        self,
        proposal_text,
        latitude,
        longitude,
        top_k=5
    ):

        # Create embedding for new proposal
        query_embedding = self.model.encode(
            [proposal_text],
            convert_to_numpy=True
        )

        faiss.normalize_L2(query_embedding)

        # Search FAISS
        similarities, indices = self.index.search(
            query_embedding,
            top_k
        )

        results = []

        for similarity, index_position in zip(
            similarities[0],
            indices[0]
        ):

            if index_position == -1:
                continue

            project = self.projects.iloc[index_position]

            # ---------------------------------------------
            # Geospatial filtering
            # ---------------------------------------------
            distance = self.haversine_distance(
                latitude,
                longitude,
                float(project["latitude"]),
                float(project["longitude"])
            )

            # Only compare projects within 5 km
            if distance <= self.radius_km:

                similarity_score = float(similarity)

                if similarity_score >= 0.85:
                    risk = "HIGH"

                elif similarity_score >= self.similarity_threshold:
                    risk = "MEDIUM"

                else:
                    risk = "LOW"

                results.append({
                    "project_id": project["id"],
                    "title": project["title"],
                    "description": project["description"],
                    "constituency": project["constituency"],
                    "category": project["category"],
                    "cost": project["cost"],
                    "status": project["status"],
                    "distance_km": round(distance, 2),
                    "similarity": round(similarity_score, 4),
                    "similarity_percent": round(
                        similarity_score * 100,
                        2
                    ),
                    "risk": risk
                })

        # Sort by highest similarity
        results.sort(
            key=lambda x: x["similarity"],
            reverse=True
        )

        # Determine final duplicate status
        duplicate_found = any(
            result["similarity"] >= self.similarity_threshold
            for result in results
        )

        return {
            "duplicate_found": duplicate_found,
            "results": results
        }


# -------------------------------------------------------------
# Test the engine directly
# -------------------------------------------------------------
if __name__ == "__main__":

    engine = SemanticDeduplicationEngine()

    test_proposal = (
        "Improvement and strengthening of rural roads "
        "connecting villages in Shimla"
    )

    result = engine.check_duplicate(
        proposal_text=test_proposal,
        latitude=31.1050,
        longitude=77.1740
    )

    print("\n--------------------------------")
    print("DUPLICATE CHECK RESULT")
    print("--------------------------------")

    if result["duplicate_found"]:
        print("⚠️ Possible duplicate project found!")
    else:
        print("✅ No duplicate project found.")

    print("\nMatching Projects:")

    for project in result["results"]:
        print(
            f"\n{project['title']}"
            f"\nSimilarity: {project['similarity_percent']}%"
            f"\nDistance: {project['distance_km']} km"
            f"\nRisk: {project['risk']}"
        )