import { GetServerSideProps } from "next";
import { ClientSafeProvider, getProviders, signIn } from "next-auth/react";
import Image from "next/image";
import spotifyLogo from "../assets/spotify-logo.png";

const Login = ({ providers }: Props) => {
  // providers can null or clientSafeProvider so that "provider?.spotify" means if providers not null , access spotify key
  const {
    /**this not declare so that
  ":" symbol not means declare a type but we use es6 syntax to change key name when destructuring
   */
    name: providerName,
    id: providerId,
  } = providers?.spotify as ClientSafeProvider;
  return (
    <div className="flex flex-col justify-center items-center bg-black h-screen">
      <div className="mb-6">
        <Image
          src={spotifyLogo}
          alt="Spotify Logo"
          height="200px"
          width="200px"
        />
      </div>
      <button
        onClick={() => {
          // this function from next-auth/react, will call redirect we to the provider(spotify) login page
          // after we login successfully with the account info that we create the app on spotify-clone app on spotify for developer
          // spotify will redirect us to a page to ask us whether we agree to let our clone-spotify app use the rights(scopes) or not
          signIn(providerId, { callbackUrl: "/" });
        }}
        className="bg-[#18d860] text-white p-5 rounded-full"
      >
        Login with {providerName}
      </button>
    </div>
  );
};

// declare Props interface for passing to generic of GetServerSideProps
interface Props {
  // providers have the type is the return type of function getProviders
  providers: Awaited<ReturnType<typeof getProviders>>;
}

export default Login;

// generic of GetServerSideProps is Props interface so that in @type of nextJs, GetServerSideProps will return {props: P} , when
// declare the function getServerSideProps we pass P as Props so that props will have to be Props interface then
// in the props of Login , we have to declare the props we receive will be Props interface
export const getServerSideProps: GetServerSideProps<Props> = async () => {
  // take the providers that we define with next-auth
  // this will take the config info of the provider that we will return by server when login page is requested
  const providers = await getProviders();
  return {
    props: {
      providers,
    },
  };
};
