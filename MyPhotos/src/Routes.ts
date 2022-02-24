export type Routes = {
  PermissionsPage: undefined;
  CameraPage: undefined;
  MediaPage: {
    data: string[];
  };
};

export interface File {
  cancelled: boolean;
  height?: number;
  type?: string;
  uri?: string;
  width?: number;
}
