from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

app = FastAPI()

# Enable CORS for all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods
    allow_headers=["*"],  # Allows all headers
)

class FileData(BaseModel):
    filename: str
    user_input: str

@app.post("/process-data/")
async def process_data(data: FileData):
    if data.filename:
        print(f"File: {data.filename}")
    if data.user_input:
        print(f"User Input: {data.user_input}")
    return {"message": "Data received successfully!"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
