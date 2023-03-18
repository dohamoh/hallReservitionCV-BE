import { roles } from "../../middleware/auth.js";
export const endPoints = {
    all:[roles.Admin,roles.User],
    admins:[roles.Admin],
    users:[roles.User],
}
