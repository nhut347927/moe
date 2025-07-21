"use client";

import { useState, useEffect } from "react";

import { useGetApi } from "@/common/hooks/use-get-api";
import { useToast } from "@/common/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Save, RefreshCw } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axiosInstance from "@/services/axios/axios-instance";
import Spinner from "@/components/common/spiner";
import { ResponseAPI } from "@/common/hooks/type";
import { RolePermission,ListRolePer } from "../type";


const PermissionsPage = () => {
  const { toast } = useToast();
  const searchParams = new URLSearchParams(window.location.search);
  const userCode = searchParams.get("code") || "";
  const [permissions, setPermissions] = useState<RolePermission[]>([]);
  const [changedPermissions, setChangedPermissions] = useState<
    RolePermission[]
  >([]);

  // Fetch permissions
  const { loading, error, refetch } = useGetApi<RolePermission[]>({
    endpoint: "/role-permission/user",
    params: { code: userCode },
    enabled: !!userCode,
    onSuccess: (data) => {
      setPermissions(data || []);
      setChangedPermissions(data || []);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        description: error.message || "Failed to load permissions",
      });
    },
  });

  // Sync changedPermissions when permissions change
  useEffect(() => {
    setChangedPermissions(permissions);
  }, [permissions]);

  // Handle permission change
  const handlePermissionChange = (
    index: number,
    field: keyof RolePermission,
    value: boolean
  ) => {
    setChangedPermissions((prev) =>
      prev.map((perm, i) => (i === index ? { ...perm, [field]: value } : perm))
    );
  };

  // Save permissions
  const handleSave = async () => {
    try {
      const payload: ListRolePer = { rolePermissions: changedPermissions };
      const response = await axiosInstance.post<ResponseAPI<string>>(
        "/role-permission",
        payload
      );
      if (response.data.code === 200) {
        toast({ description: "Permissions saved successfully" });
        setPermissions(changedPermissions);
      } else {
        throw new Error(response.data.message || "Failed to save permissions");
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        description: error.message || "Failed to save permissions",
      });
    }
  };

  // Reset changes
  const handleReset = () => {
    setChangedPermissions(permissions);
    toast({ description: "Changes reset" });
  };

  return (
    <div className="w-full flex-1 flex justify-center">
      <ScrollArea className="max-w-full overflow-auto">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
          Permissions Management {userCode && `for User: ${userCode}`}
        </h1>

        {/* Actions */}
        <div className="flex items-center gap-2 mb-4">
          <Button
            variant="outline"
            onClick={refetch}
            className="h-10 px-3 rounded-xl"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button
            variant="default"
            onClick={handleSave}
            className="h-10 px-3 rounded-xl"
            disabled={loading || !changedPermissions.length}
          >
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
       
          <Button
            variant="outline"
            onClick={handleReset}
            className="h-10 px-3 rounded-xl"
            disabled={loading || !changedPermissions.length}
          >
            Reset
          </Button>
        </div>

        {/* Permissions Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Role Name</TableHead>
              <TableHead>Can View</TableHead>
              <TableHead>Can Insert</TableHead>
              <TableHead>Can Update</TableHead>
              <TableHead>Can Delete</TableHead>
              <TableHead>Can Restore</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {permissions.length === 0 && !loading ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-zinc-500 dark:text-zinc-400"
                >
                  {userCode
                    ? "No permissions found for this user"
                    : "No user code provided"}
                </TableCell>
              </TableRow>
            ) : (
              changedPermissions.map((perm, index) => (
                <TableRow key={perm.code}>
                  <TableCell>{perm.roleName}</TableCell>
                  <TableCell>
                    <Switch
                      checked={perm.canView}
                      onCheckedChange={(value) =>
                        handlePermissionChange(index, "canView", value)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={perm.canInsert}
                      onCheckedChange={(value) =>
                        handlePermissionChange(index, "canInsert", value)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={perm.canUpdate}
                      onCheckedChange={(value) =>
                        handlePermissionChange(index, "canUpdate", value)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={perm.canDelete}
                      onCheckedChange={(value) =>
                        handlePermissionChange(index, "canDelete", value)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={perm.canRestore}
                      onCheckedChange={(value) =>
                        handlePermissionChange(index, "canRestore", value)
                      }
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center mt-4">
            <Spinner className="w-6 h-6 text-zinc-500" />
            <span className="ml-2 text-sm text-zinc-500">Loading...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center text-red-500 mt-4">
            Failed to load permissions: {error.message}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default PermissionsPage;
