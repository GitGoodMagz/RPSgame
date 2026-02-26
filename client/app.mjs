import { subscribe } from "./app/state.mjs";
import { bootstrapUsers, syncNavAvailability } from "./app/users.mjs";
import { setupLegalDialogTabs } from "./app/legalDialog.mjs";
import { wireNavigation, bootstrapView } from "./app/nav.mjs";
import { CreateUser } from "./app/components/userCreate.mjs";
import { ManageUser } from "./app/components/userManage.mjs";

customElements.define("user-create", CreateUser);
customElements.define("user-manage", ManageUser);

setupLegalDialogTabs();
wireNavigation();

subscribe((s) => syncNavAvailability(s));
bootstrapUsers();
bootstrapView();
