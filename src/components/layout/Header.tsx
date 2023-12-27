import Image from "next/image";
import Link from "next/link";

type NavItem = {
  title: string;
  slug: string;
};
const navigationList: NavItem[] = [
  {
    title: "home",
    slug: "/",
  },
  {
    title: "projects",
    slug: "/",
  },
  {
    title: "blog",
    slug: "/",
  },
  {
    title: "useful articles",
    slug: "/",
  },
];

const GeneralInfo = () => {
  return (
    <section className="flex justify-center items-center w-full gap-4">
      <div className="rounded-full flex items-center justify-center overflow-hidden">
        <Image
          src={"/avatar.jpg"}
          alt="profile picture"
          height={40}
          width={40}
          className="object-cover object-center h-10 w-10"
        />
      </div>
      <div className="flex flex-col justify-start items-start">
        <h1 className="font-semibold text-2xl text-left m-0">Erfan Korki</h1>
        <h2>Software Engineer</h2>
      </div>
    </section>
  );
};

const NavigationItem = ({
  item,
}: {
  item: { title: string; slug: string };
}) => {
  return (
    <li className="flex items-center justify-center gap-4">
      <Link href={item.slug}>
        <p className="font-semibold text-left">{item.title}</p>
      </Link>
    </li>
  );
};

const Navigation = () => {
  return (
    <nav className="flex flex-col justify-start items-center mt-10">
      <ul className="flex flex-col justify-start items-center gap-4">
        {navigationList.map((nav) => {
          return <NavigationItem item={nav} key={nav.title} />;
        })}
      </ul>
    </nav>
  );
};

const Header = () => {
  return (
    <div className="w-full h-full py-10 flex flex-col justify-start items-center bg-blue-50">
      <GeneralInfo />
      <Navigation />
    </div>
  );
};

export default Header;
