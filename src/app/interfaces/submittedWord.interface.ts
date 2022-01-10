export interface SubmittedWord{
  word:string;
  userName:string;
  userEmail:string;
  example:[string];
  userId?:string;
  submitAnonymous?:boolean;
  isApproved?:boolean;
  isRejected?:boolean;
}
