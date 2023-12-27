import Header from "@/components/layout/Header";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="w-full flex items-center justify-center">
      <aside className="w-72 h-screen flex flex-col justify-start items-center">
        <Header />
      </aside>
      <article className="grow">{children}</article>
    </main>
  );
};

export default MainLayout;
