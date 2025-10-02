import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Navigation,
  Icon,
  TextField,
  Avatar,
  Button,
  Text,
} from "@shopify/polaris";
import {
  HomeIcon,
  OrderIcon,
  ProductIcon,
  PersonIcon,
  SettingsIcon,
  SearchIcon,
  ChevronDownIcon,
} from "@shopify/polaris-icons";

export function Sidebar() {
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/991ee9a0afad461fa9386316c87fe366/fccf2e7ec9723b0ade97e83d78184ae7dc22e34b?placeholderIfAbsent=true"
            alt="Logo"
          />
          <Text variant="headingMd" as="h2">Dashdark X</Text>
        </div>
        <TextField
          label="Search"
          labelHidden
          autoComplete="off"
          prefix={<Icon source={SearchIcon} />}
          placeholder="Search for..."
          value={searchValue}
          onChange={handleSearchChange}
        />
      </div>

      <Navigation location="/">
        <Navigation.Section
            items={[
              {
                url: "/admin",
                label: "Dashboard",
                icon: HomeIcon,
                selected: false,
              },
              {
                url: "/admin/products",
                label: "Products",
                icon: ProductIcon,
                selected: false,
              },
              {
                url: "/admin/orders",
                label: "Orders",
                icon: OrderIcon,
                selected: false,
              },
            ]}
        />

        <Navigation.Section
          separator
          title="Settings"
          items={[
           
            {
              url: "/admin/users",
              label: "Users",
              icon: PersonIcon,
            },
            {
              url: "/admin/invoices",
              label: "Invoices",
              icon: OrderIcon,
            },
            {
              url: "#",
              label: "Settings",
              icon: SettingsIcon,
            },
          ]}
        />
      </Navigation>

      <div className="sidebar-footer">
        <div className="user-profile">
          <Avatar customer name="John Carter" />
          <div className="user-info">
            <Text variant="bodyMd" as="p">John Carter</Text>
            <Text variant="bodySm" as="span" tone="subdued">
              Account settings
            </Text>
          </div>
          <Button variant="plain" icon={ChevronDownIcon} />
        </div>
        <Button variant="primary" fullWidth onClick={() => navigate("/")}>
          Déconnexion
        </Button>
      </div>
    </div>
  );
}
