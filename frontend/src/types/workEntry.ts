// Type for hours in "HH:mm" format
type TimeString = `${number}:${number}`;

// Type for date in "YYYY-MM-DD" format
type DateString = `${number}-${number}-${number}`;

// Type for a work entry
export interface WorkEntry {
    id: number;
    userId: number;
    date: DateString;
    location: string;
    teammate: string;
    startTime: TimeString;
    endTime: TimeString;
    breakDuration: number; // en minutes
    created_at: string;
}

// Type for an entry formatted for display
export interface FormattedWorkEntry extends WorkEntry {
    formattedDate: string;    // Formatted local date
    totalHours: string;       // Total hours with 2 decimals
}

// Type for the create/edit form
export type WorkEntryFormData = Omit<WorkEntry, 'id' | 'userId' | 'created_at'>;

// Type for the API response
export type WorkEntryResponse = {
    success: boolean;
    data: WorkEntry;
    message?: string;
};