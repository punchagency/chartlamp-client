import MenuItem from "@/components/MenuItem";
import { Stack } from "@mui/material";
import { pxToRem } from "../../../theme";
import ICDMapperIcon from "../components/svg/IcdMapper";
import LogoutIcon from "../components/svg/LogoutIcon";
import NotificationIcon from '../components/svg/NotificationIcon';
import ProfileIcon from '../components/svg/ProfileIcon';
import SecurityIcon from '../components/svg/SecuirtyIcon';



export default function SettingsSideMenu({ setTab, seletectedTab }: { setTab: (tab: string) => void, seletectedTab: string }) {
  const isActive = (name: string) => seletectedTab === name;

  const menuItems = [
    { text: "Profile", Icon: <ProfileIcon />, name: "profile" },
    { text: "Password & Security", Icon: <SecurityIcon />, name: "security" },
    { text: "Notification", Icon: <NotificationIcon />, name: "notifications" },
    { text: "ICD-Mapper", Icon: <ICDMapperIcon />, name: "icd-mapper" },
  ];

  const logoutItem = { text: "Logout", Icon: <LogoutIcon />, name: "logout" };

  return (
    <Stack sx={{ mt: pxToRem(45), alignItems: "flex-start", justifyContent: "space-between", height: '93%' }} spacing={1}>
      <Stack direction="column" spacing={2} sx={{ width: '95%' }}>
        {menuItems.map(({ text, Icon, name }) => (
          <MenuItem key={name} text={text} Icon={Icon} name={name} isActive={isActive(name)} setTab={setTab} />
        ))}
      </Stack>
      <Stack direction="column" spacing={2} sx={{ width: '95%' }}>
        <MenuItem text={logoutItem.text} Icon={logoutItem.Icon} name={logoutItem.name} isActive={isActive(logoutItem.name)} setTab={setTab} />
      </Stack>
    </Stack>
  );
}