import { Document, Schema } from 'mongoose';
import { field } from './utils';

export interface IEmailSignature {
  brandId?: string;
  signature?: string;
}

export interface IEmailSignatureDocument extends IEmailSignature, Document {}

export interface IDetail {
  avatar?: string;
  fullName?: string;
  shortName?: string;
  position?: string;
  location?: string;
  description?: string;
}

export interface IDetailDocument extends IDetail, Document {}

export interface ILink {
  linkedIn?: string;
  twitter?: string;
  facebook?: string;
  github?: string;
  youtube?: string;
  website?: string;
}

interface ILinkDocument extends ILink, Document {}

export interface IUser {
  username?: string;
  password: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  registrationToken?: string;
  registrationTokenExpires?: Date;
  isOwner?: boolean;
  email?: string;
  getNotificationByEmail?: boolean;
  emailSignatures?: IEmailSignature[];
  starredConversationIds?: string[];
  details?: IDetail;
  links?: ILink;
  isActive?: boolean;
  brandIds?: string[];
  groupIds?: string[];
  deviceTokens?: string[];
  doNotDisturb?: string;
}

export interface IUserDocument extends IUser, Document {
  _id: string;
  emailSignatures?: IEmailSignatureDocument[];
  details?: IDetailDocument;
  links?: ILinkDocument;
}

// Mongoose schemas ===============================
const emailSignatureSchema = new Schema(
  {
    brandId: field({ type: String, label: 'Brand' }),
    signature: field({ type: String, label: 'Signature' }),
  },
  { _id: false },
);

// Detail schema
const detailSchema = new Schema(
  {
    avatar: field({ type: String, label: 'Avatar' }),
    shortName: field({ type: String, optional: true, label: 'Short name' }),
    fullName: field({ type: String, label: 'Full name' }),
    position: field({ type: String, label: 'Position' }),
    location: field({ type: String, optional: true, label: 'Location' }),
    description: field({ type: String, optional: true, label: 'Description' }),
  },
  { _id: false },
);

const linkSchema = new Schema(
  {
    linkedIn: field({ type: String, optional: true, label: 'LinkedIn' }),
    twitter: field({ type: String, optional: true, label: 'Twitter' }),
    facebook: field({ type: String, optional: true, label: 'Facebook' }),
    github: field({ type: String, optional: true, label: 'Github' }),
    youtube: field({ type: String, optional: true, label: 'Youtube' }),
    website: field({ type: String, optional: true, label: 'Website' }),
  },
  { _id: false },
);

// User schema
export const userSchema = new Schema({
  _id: field({ pkey: true }),
  username: field({ type: String, label: 'Username' }),
  password: field({ type: String }),
  resetPasswordToken: field({ type: String }),
  registrationToken: field({ type: String }),
  registrationTokenExpires: field({ type: Date }),
  resetPasswordExpires: field({ type: Date }),
  isOwner: field({ type: Boolean, label: 'Is owner' }),
  email: field({
    type: String,
    unique: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/, 'Please fill a valid email address'],
    label: 'Email',
  }),
  getNotificationByEmail: field({ type: Boolean, label: 'Get notification by email' }),
  emailSignatures: field({ type: [emailSignatureSchema], label: 'Email signatures' }),
  starredConversationIds: field({ type: [String], label: 'Starred conversations' }),
  details: field({ type: detailSchema, default: {}, label: 'Details' }),
  links: field({ type: linkSchema, default: {}, label: 'Links' }),
  isActive: field({ type: Boolean, default: true, label: 'Is active' }),
  brandIds: field({ type: [String], label: 'Brands' }),
  groupIds: field({ type: [String], label: 'Groups' }),
  deviceTokens: field({ type: [String], default: [], label: 'Device tokens' }),
  doNotDisturb: field({ type: String, optional: true, default: 'No', label: 'Do not disturb' }),
});
