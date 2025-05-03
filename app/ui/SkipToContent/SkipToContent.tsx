import "./SkipToContent.css";
import Text from "../Text/Text";

const SkipToContent: React.FC = () => {
  const handleSkipToContent = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    window.location.hash = "main-content";
  };
  return (
    <a
      href="#main-content"
      className="skip-to-content"
      onClick={handleSkipToContent}
    >
      <Text>Skip to main content</Text>
    </a>
  );
};

export default SkipToContent;
