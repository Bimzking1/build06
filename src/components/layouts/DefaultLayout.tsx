export interface IDefaultLayout {
  children: React.ReactNode;
}

const DefaultLayout = ({ children }: IDefaultLayout): React.ReactElement => {
  return <div>{children}</div>;
};

export default DefaultLayout;
