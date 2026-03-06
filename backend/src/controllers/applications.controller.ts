import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import type { RequestHandler } from "express";

const prisma = new PrismaClient();

type Status = "new" | "assigned" | "completed";

const isStatus = (v: unknown): v is Status =>
  v === "new" || v === "assigned" || v === "completed";

const pickApplicationInclude = {
  admin: { select: { email: true, name: true } },
};

export const createApplication = async (req: Request, res: Response) => {
  try {
    const { clientName, phone, room, time } = req.body;

    if (!clientName || !phone || !room) {
      return res.status(400).json({ error: "clientName, phone, room are required" });
    }

    const newApplication = await prisma.application.create({
      data: {
        clientName: String(clientName).trim(),
        phone: String(phone).trim(),
        room: String(room).trim(),
        // если поля time нет в схеме — убери 2 строки ниже
        time: time ? new Date(time) : undefined,
        status: "new",
      },
      include: pickApplicationInclude,
    });

    return res.status(201).json(newApplication);
  } catch (error) {
    console.error("Error in createApplication controller.", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const getAllApplications: RequestHandler = async (req, res) => {
    try {
    const status = req.query.status as string | undefined;

    const applications = await prisma.application.findMany({
      where: status ? { status } : {},
      include: pickApplicationInclude,
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json(applications);
  } catch (error) {
    console.error("Error in getAllApplications controller.", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

interface RequestParams {
  id: string;
}

export const getApplicationById: RequestHandler = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      return res.status(400).json({ error: "Valid ID is required" });
    }

    const application = await prisma.application.findUnique({
      where: { id },
      include: pickApplicationInclude,
    });

    if (!application) {
      return res.status(404).json({ error: "Current application not found." });
    }

    return res.status(200).json(application);
  } catch (error) {
    console.error("Error in getApplicationById controller.", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// PATCH /applications/:id
// updateData может включать: status, time, adminEmail (для назначения)
export const updateApplicationById: RequestHandler = async (req, res)  => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      return res.status(400).json({ error: "Valid ID is required" });
    }

    const { status, time, adminEmail, clientName, phone, room } = req.body as {
      status?: unknown;
      time?: string;
      adminEmail?: string;
      clientName?: string;
      phone?: string;
      room?: string;
    };
    const data: any = {};

    if (typeof clientName === "string") data.clientName = clientName.trim();
    if (typeof phone === "string") data.phone = phone.trim();
    if (typeof room === "string") data.room = room.trim();

    if (typeof time === "string" && time.trim()) data.time = new Date(time);

    if (typeof status !== "undefined") {
      if (!isStatus(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }
      data.status = status;
    }

    if (typeof adminEmail === "string" && adminEmail.trim()) {
      const admin = await prisma.admin.findUnique({
        where: { email: adminEmail.trim() },
      });
      if (!admin) return res.status(404).json({ error: "Admin not found" });

      data.adminId = admin.id;
      if (!data.status) data.status = "assigned";
    }

    const application = await prisma.application.update({
      where: { id },
      data,
      include: pickApplicationInclude,
    });

    return res.status(200).json(application);
  } catch (error: any) {
    console.error("Error in updateApplication controller.", error);

    if (error?.code === "P2025") {
      return res.status(404).json({ error: "Application not found." });
    }
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const deleteApplicationById: RequestHandler = async (req, res)  => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      return res.status(400).json({ error: "Valid ID is required" });
    }

    await prisma.application.delete({ where: { id } });

    return res.status(200).json({ message: "Application deleted successfully" });
  } catch (error: any) {
    console.error("Error in deleteApplicationById controller.", error);

    if (error?.code === "P2025") {
      return res.status(404).json({ error: "Application not found." });
    }
    return res.status(500).json({ error: "Internal server error." });
  }
};