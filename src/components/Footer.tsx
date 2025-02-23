import packageJson from '../../package.json';

const Footer: React.FC = () => {
  return (
    <footer className="text-center py-4 text-gray-500 text-xs">
      © {new Date().getFullYear()} {packageJson.author}. All rights reserved.
    </footer>
  );
};

export default Footer;

