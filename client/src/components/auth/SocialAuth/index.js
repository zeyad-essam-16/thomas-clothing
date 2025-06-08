import classes from "./SocialAuth.module.css";

const SocialAuth = ({ isCheckingOut }) => {
  const googleLogin = () => {
    window.open(
      `/api/auth/google${
        isCheckingOut ? "?checkout=true" : ""
      }`,
      "_self"
    );
  };

  return (
    <div className={classes.social_auth}>
      <div onClick={googleLogin}>
        <img
          src="https://res.cloudinary.com/drru4lsys/image/upload/v1679210303/ui%20images/google_icon.png"
          alt="google icon"
        />
        <span>Continue With Google</span>
      </div>
    </div>
  );
};

export default SocialAuth;
