import { Icon } from "@iconify/react";
import pieChart2Fill from "@iconify/icons-eva/pie-chart-2-fill";
import peopleFill from "@iconify/icons-eva/people-fill";
import shoppingBagFill from "@iconify/icons-eva/shopping-bag-fill";
import fileTextFill from "@iconify/icons-eva/file-text-fill";

// ----------------------------------------------------------------------

const getIcon = (name) => <Icon icon={name} width={22} height={22} />;

const sidebarConfig = [
  {
    title: "Dossier à réexpédier",
    path: "/dashboard/dossierAReexpedier",
    icon: getIcon(pieChart2Fill),
  },
  {
    title: "Enregistrement rejets",
    path: "/dashboard/app",
    icon: getIcon(pieChart2Fill),
  },
  {
    title: "Actions agence ",
    path: "/dashboard/actions",
    icon: getIcon(peopleFill),
  },
  {
    title: "Consultation dossier / IMMA",
    path: "/dashboard/consDossierIMM",
    icon: getIcon(shoppingBagFill),
  },
  {
    title: "Consultation de l'encours",
    path: "/dashboard/consultationEncours",
    icon: getIcon(fileTextFill),
  } /*,
  {
    title: 'login',
    path: '/login',
    icon: getIcon(lockFill)
  },
  {
    title: 'register',
    path: '/register',
    icon: getIcon(personAddFill)
  },
  {
    title: 'Not found',
    path: '/404',
    icon: getIcon(alertTriangleFill)
  }*/,
];

export default sidebarConfig;
