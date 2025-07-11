import { USER_CONFIG } from "./userConfig";

export const getEmailConfig = (userType: UserType) => {
  return USER_CONFIG[userType];
};