function sidebarOptions() {
  const menuItemsForAll = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: "ri-dashboard-2-line",
      link: "/dashboard",
    },
    {
      id: "integrations",
      label: "Integrations",
      icon: "",
      link: "/integrations",
    },
    {
      id: "fieldMapping",
      label: "Field Mapping",
      icon: "",
      link: "/fieldMapping",
    },
    // {
    //   id: "user",
    //   label: "User",
    //   icon: "",
    //   link: "/user",
    // },
  ];
  return menuItemsForAll;
}

export default sidebarOptions;
