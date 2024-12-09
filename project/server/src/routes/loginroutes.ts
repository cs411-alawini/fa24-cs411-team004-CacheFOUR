import { Router, Request, Response } from "express";
import { validateAndGetUser, createUser, updateUser, deleteUser,createUpdateExperienceTrigger} from "../services/database";
import { UserAccount } from "../models/UserAccount";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
    try {

        const userId = parseInt(req.query.userId as string, 10); // Parse userId from query string
        const name = req.query.name as string;

        if (isNaN(userId) || !name){
            res.status(400).json({ message: "Invalid or missing userId or name" });
            return;
        }

        const userInfo: UserAccount | null = await validateAndGetUser(userId, name);

        if (!userInfo) {
            // If no user is found, return 404
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(200).json(userInfo);
    } catch (error) {
        console.error("Error retrieving user info:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});



router.post("/signup", async (req: Request, res: Response) => {
    try {
        const user: Omit<UserAccount, "userId"> = req.body;
        const newUserId= await createUser(user);

        // Respond with success status
        res.status(201).json({ message: "User created successfully",userId:newUserId });
    } catch (error: any) {
        console.error("Error creating user:", error);
        if (error.message === "Duplicate entry") {
            res.status(409).json({ message: "User already exists with the same information" });
            return;
        }
        res.status(500).json({ message: "Internal server error" });
    }
});

// Route to update user information
router.put("/update", async (req: Request, res: Response) => {
    try {
        const user: UserAccount = req.body;
        await updateUser(user);
        res.status(200).json({ message: "User updated successfully" });
    } catch (error: any) {
        console.error("Error updating user:", error);
        if (error.message === "User not found"){
            res.status(404).json({ message: "User not found" });
            return;
        }
        
        if (error.message === "Missing required user fields"){ 
            res.status(400).json({ message: "Missing required user fields" });
            return;
        }
        
        res.status(500).json({ message: "Internal server error" });
    }
});


// Route to delete user information
router.delete("/delete/:userId", async (req: Request, res: Response) => {
    try {
        const userId = parseInt(req.params.userId, 10);
        if (isNaN(userId)) {
            res.status(400).json({ message: "Invalid userId" });
            return;
        }
        await deleteUser(userId);
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error: any) {
        console.error("Error deleting user:", error);
        if (error.message === "User not found") {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(500).json({ message: "Internal server error" });
    }
});

// Route to create the update experience trigger
router.post("/create-experience-trigger", async (req: Request, res: Response) => {
    try {
        await createUpdateExperienceTrigger();
        res.status(200).json({ message: "Trigger 'update_experience_trigger' created successfully" });
    } catch (error) {
        console.error("Error creating trigger 'update_experience_trigger':", error);
        res.status(500).json({ message: "Failed to create trigger" });
    }
});

export default router;
