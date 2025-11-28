import Navbar from './Navbar';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex flex-col h-screen bg-base-200">
      <Navbar />
      <main className="flex-1 overflow-auto p-6">
        {children}
      </main>
    </div>
  );
}
