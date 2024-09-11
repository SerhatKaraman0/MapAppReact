import React, { useState, ChangeEvent, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FaPencilAlt } from "react-icons/fa";
import { LuMenu } from "react-icons/lu";
import { Tab, TabsOnBottomProps } from "../components/MapFunctions/interfaces";

const TabsOnBottom: React.FC<TabsOnBottomProps> = ({ onTabChange }) => {
  const [tabs, setTabs] = useState<Tab[]>([
    { id: "tabs-with-card-1", label: "Tab 1", tabColor: "#4F46E5" },
  ]);
  const [activeTab, setActiveTab] = useState<string>("tabs-with-card-1");

  const [newTabName, setNewTabName] = useState<string>("");
  const [newTabColor, setNewTabColor] = useState<string>("#4F46E5");

  const updatedTab = (
    tabId: string,
    updatedColor: string,
    updatedName: string
  ) => {
    setTabs((prevTabs) =>
      prevTabs.map((tab) =>
        tab.id === tabId
          ? { ...tab, tabColor: updatedColor, label: updatedName }
          : tab
      )
    );
  };

  const handleTabUpdate = (tabId: string) => {
    updatedTab(tabId, newTabColor, newTabName);
  };

  const addNewTab = () => {
    if (tabs.length < 5) {
      const newTabId = `tabs-with-card-${tabs.length + 1}`;
      const newTab = {
        id: newTabId,
        label: `Tab ${tabs.length + 1}`,
        tabColor: "#4F46E5",
      };
      setTabs([...tabs, newTab]);
      setActiveTab(newTabId);
    } else {
      toast.info("Maximum Tabs Reached", {
        position: "top-left",
      });
    }
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-10 bg-white py-1">
      <div className="tabs">
        <div className="flex">
          <ul className="flex flex-wrap transition-all duration-300 overflow-hidden">
            <li className="flex items-center justify-center">
              <button
                onClick={addNewTab}
                className="w-12 h-12 text-gray-500 hover:text-gray-800 font-medium rounded-lg border-2 bg-white flex items-center justify-center ml-2 mr-2"
              >
                +
              </button>
            </li>
            <li className="flex items-center justify-center mr-2">
              <Menubar>
                <MenubarMenu>
                  <MenubarTrigger>
                    <LuMenu />
                  </MenubarTrigger>
                  <MenubarContent>
                    {tabs.map((tab) => (
                      <MenubarItem
                        key={tab.id}
                        onClick={() => {
                          setActiveTab(tab.id);
                          if (onTabChange) onTabChange(tab.id);
                        }}
                      >
                        {tab.label}
                      </MenubarItem>
                    ))}
                  </MenubarContent>
                </MenubarMenu>
              </Menubar>
            </li>
            {tabs.map((tab) => (
              <li
                key={tab.id}
                className={`flex items-center py-4 px-6 ${
                  activeTab === tab.id
                    ? "text-white rounded-xl shadow"
                    : "bg-white text-gray-500"
                }`}
                style={{
                  backgroundColor:
                    activeTab === tab.id ? tab.tabColor : "transparent",
                }}
              >
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab(tab.id);
                    if (onTabChange) onTabChange(tab.id);
                  }}
                  className="flex-1"
                  data-tab={tab.id}
                  role="tab"
                >
                  {tab.label}
                </a>
                <Separator orientation="vertical" className="mx-2" />
                <Popover>
                  <PopoverTrigger>
                    <FaPencilAlt />
                  </PopoverTrigger>
                  <PopoverContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium">Change Tab Name</h3>
                        <p className="text-slate-500">
                          Fill out the form to change the tab name and display
                          color.
                        </p>
                      </div>
                      <form
                        className="space-y-4"
                        onSubmit={(e: FormEvent) => {
                          e.preventDefault();
                          handleTabUpdate(tab.id);
                        }}
                      >
                        <div className="space-y-4">
                          <div className="space-y-1">
                            <Label htmlFor="tab-name">New Tab Name</Label>
                            <Input
                              id="tab-name"
                              placeholder="Enter the tab name"
                              value={newTabName}
                              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                setNewTabName(e.target.value)
                              }
                            />
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor="color">Select color for tab</Label>
                            <input
                              type="color"
                              id="color"
                              name="color"
                              value={newTabColor}
                              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                setNewTabColor(e.target.value)
                              }
                              className="w-full"
                            />
                          </div>
                        </div>
                        <Button type="submit" size="sm">
                          Change Tab
                        </Button>
                      </form>
                    </div>
                  </PopoverContent>
                </Popover>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TabsOnBottom;
