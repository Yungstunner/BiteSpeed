import express, { Request, Response, NextFunction } from "express";
import cors from "cors"; // ✅ import cors
import { identify, IdentifyInput } from "./contactService";

const app = express();

// ✅ Enable CORS for all origins (or restrict to your frontend URL)
app.use(cors({
  origin: "http://localhost:5173", // replace with your frontend URL
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
}));

app.use(express.json());

app.post("/identify", async (req: Request, res: Response) => {
  try {
    const body = req.body as IdentifyInput;

    // make sure to await if identify is async
    const result = await identify({
      email: body.email ?? null,
      phoneNumber: body.phoneNumber ?? null,
    });

    res.status(200).json({
      contact: {
        primaryContactId: result.primaryContactId,
        emails: result.emails,
        phoneNumbers: result.phoneNumbers,
        secondaryContactIds: result.secondaryContactIds,
      },
    });
  } catch (err: any) {
    res.status(400).json({
      error: err?.message ?? "Something went wrong",
    });
  }
});

// Global error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  res.status(500).json({ error: "Internal server error" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});