from fastapi import FastAPI 
from app.routes import school, users, auth, super_admin
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine

Base.metadata.create_all(bind=engine)
app = FastAPI(
    title="EduAccess API",
    version="1.0",
    openapi_prefix="/eduaccess/v1"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(super_admin.router)
app.include_router(school.router)

@app.get("/")
def root():
    return {"message": "Welcome to eduaccess API"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)