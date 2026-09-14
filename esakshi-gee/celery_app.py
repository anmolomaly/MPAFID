import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from celery import Celery

# Broker URL – adjust if your RabbitMQ server is elsewhere
BROKER_URL = "amqp://guest:guest@localhost:5672//"

celery = Celery(
    "esakshi_gee",
    broker=BROKER_URL,
    backend="rpc://",
    imports=["tasks"],
)

# Optional: configure task serialization, retries, etc.
celery.conf.update(
    task_serializer="json",
    result_serializer="json",
    accept_content=["json"],
    task_acks_late=True,
    worker_prefetch_multiplier=1,
    result_expires=3600,  # 1 hour
)
