import mongoose, { Document, Schema } from 'mongoose';

// Legal section interface
interface LegalSection {
  section: string;
  title: string;
  description: string;
  confidence: number;
}

// FIR document interface
export interface IFIR extends Document {
  firNumber: string;
  complainantName: string;
  complainantContact: string;
  complainantPhone: string;
  complainantEmail?: string;
  complainantAddress: string;
  complainantIdType: string;
  complainantIdNumber: string;
  incidentDate: Date;
  incidentTime: string;
  incidentLocation: string;
  incidentDescription: string;
  suspectName?: string;
  suspectDescription?: string;
  witnessDetails?: string;
  policeStationName: string;
  policeStationCode?: string;
  district: string;
  state: string;
  status: string;
  priority: string;
  assignedTo?: string;
  legalSections?: LegalSection[];
  followUpQuestions?: string[];
  evidenceDetails?: string;
  officerRemarks?: string;
  attachments?: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Create schema
const FIRSchema = new Schema<IFIR>(
  {
    firNumber: {
      type: String,
      required: [true, 'FIR number is required'],
      unique: true,
      index: true,
    },
    complainantName: {
      type: String,
      required: [true, 'Complainant name is required'],
      index: true,
    },
    complainantPhone: {
      type: String,
      required: [true, 'Complainant phone number is required'],
    },
    complainantEmail: {
      type: String,
      validate: {
        validator: function (v: string) {
          return !v || /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
        },
        message: 'Please enter a valid email address',
      },
    },
    complainantAddress: {
      type: String,
      required: [true, 'Complainant address is required'],
    },
    complainantIdType: {
      type: String,
      required: [true, 'ID type is required'],
      enum: ['Aadhar', 'PAN', 'Driving License', 'Voter ID', 'Passport', 'Other'],
    },
    complainantIdNumber: {
      type: String,
      required: [true, 'ID number is required'],
    },
    incidentDate: {
      type: Date,
      required: [true, 'Incident date is required'],
      index: true,
    },
    incidentTime: {
      type: String,
      required: [true, 'Incident time is required'],
    },
    incidentLocation: {
      type: String,
      required: [true, 'Incident location is required'],
      index: true,
    },
    incidentDescription: {
      type: String,
      required: [true, 'Incident description is required'],
      index: true,
    },
    suspectName: {
      type: String,
    },
    suspectDescription: {
      type: String,
    },
    witnessDetails: {
      type: String,
    },
    policeStationName: {
      type: String,
      required: [true, 'Police station name is required'],
      index: true,
    },
    policeStationCode: {
      type: String,
    },
    district: {
      type: String,
      required: [true, 'District is required'],
    },
    state: {
      type: String,
      required: [true, 'State is required'],
    },
    status: {
      type: String,
      required: [true, 'Status is required'],
      enum: ['New', 'Under Investigation', 'Closed', 'Pending', 'Cancelled'],
      default: 'New',
      index: true,
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Urgent'],
      default: 'Medium',
    },
    assignedTo: {
      type: String,
    },
    legalSections: [
      {
        section: {
          type: String,
          required: true,
        },
        title: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
        confidence: {
          type: Number,
          required: true,
          min: 0,
          max: 1,
        },
      },
    ],
    followUpQuestions: [String],
    evidenceDetails: {
      type: String,
    },
    officerRemarks: {
      type: String,
    },
    attachments: [String],
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
    versionKey: false // Remove the __v field
  }
);

// Create text index for full-text search
FIRSchema.index({
  complainantName: 'text',
  incidentDescription: 'text',
  incidentLocation: 'text',
  suspectName: 'text',
  suspectDescription: 'text',
  witnessDetails: 'text',
  officerRemarks: 'text',
});

// Export the model
let FIR: mongoose.Model<IFIR>;

try {
  // Try to get the model if it exists
  FIR = mongoose.model<IFIR>('FIR');
} catch {
  // Create a new model if it doesn't exist
  FIR = mongoose.model<IFIR>('FIR', FIRSchema);
}

export default FIR;