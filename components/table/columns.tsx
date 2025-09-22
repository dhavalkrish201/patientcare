"use client";

import { Doctors } from "@/constants";
import { getPatient } from "@/lib/actions/patient.actions";
import { formatDateTime } from "@/lib/utils";
import { Appointment } from "@/types/appwrite.types";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { useEffect, useState } from "react";
import AppointmentModel from "../AppointmentModel";
import StatusBadge from "../StatusBadge";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<Appointment>[] = [
  {
    header: "ID",
    cell: ({ row }) => <p className="text-14-medium">{row.index + 1}</p>,
  },
  {
    accessorKey: "patient",
    header: "Patient",
    cell: ({ row }) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [patient, setPatient] = useState(null);

      // eslint-disable-next-line react-hooks/rules-of-hooks
      useEffect(() => {
        const fetchPatient = async () => {
          const data = await getPatient(row.original.userId);
          setPatient(data);
        };
        fetchPatient();
      }, [row.original.userId]);

      if (!patient) return <p>Loading...</p>;
      return <p className="whitespace-nowrap">{patient.name}</p>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div>
        <StatusBadge status={row.original.status} />
      </div>
    ),
  },
  {
    accessorKey: "schedule",
    header: "Appointment",
    cell: ({ row }) => (
      <p className="text-14-regular min-w-[100px]">
        {formatDateTime(row.original.schedule).dateTime}
      </p>
    ),
  },
  {
    accessorKey: "primaryPhysician",
    header: "Physician",
    cell: ({ row }) => {
      const doctor = Doctors.find(
        (doc) => doc.name === row.original.primaryPhysician
      );
      return (
        <div>
          <Image
            src={doctor?.image}
            alt={doctor.name}
            width={100}
            height={100}
            className="size-8"
          />
          <p className="whitespace-nowrap">Dr. {doctor?.name}</p>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="pl-4">Actions</div>,
    cell: ({ row: { original: data } }) => {
      return (
        <div className="flex gap-1">
          <AppointmentModel
            type="schedule"
            patientId={data.patient.$id}
            userId={data.userId}
            appointment={data}
          />
          <AppointmentModel
            type="cancel"
            patientId={data.patient.$id}
            userId={data.userId}
            appointment={data}
          />
        </div>
      );
    },
  },
];
