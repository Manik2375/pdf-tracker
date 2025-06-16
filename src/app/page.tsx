"use client";
// import { useSession } from "next-auth/react";
// import { FormEvent } from "react";
// import { useRouter } from "next/navigation";
// import { signIn } from "next-auth/react"
import { signIn } from "next-auth/react";

const oauthApplications = [
  {
    id: 1,
    title: "Google",
    logo: (
      <svg
        width="30"
        height="30"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M22.501 12.2332C22.501 11.3699 22.4296 10.7399 22.2748 10.0865H12.2153V13.9832H18.12C18.001 14.9515 17.3582 16.4099 15.9296 17.3898L15.9096 17.5203L19.0902 19.935L19.3106 19.9565C21.3343 18.1249 22.501 15.4298 22.501 12.2332Z"
          fill="#4285F4"
        />
        <path
          d="M12.214 22.5C15.1068 22.5 17.5353 21.5666 19.3092 19.9567L15.9282 17.3899C15.0235 18.0083 13.8092 18.4399 12.214 18.4399C9.38069 18.4399 6.97596 16.6083 6.11874 14.0766L5.99309 14.0871L2.68583 16.5954L2.64258 16.7132C4.40446 20.1433 8.0235 22.5 12.214 22.5Z"
          fill="#34A853"
        />
        <path
          d="M6.12046 14.0767C5.89428 13.4234 5.76337 12.7233 5.76337 12C5.76337 11.2767 5.89428 10.5767 6.10856 9.92337L6.10257 9.78423L2.75386 7.2356L2.64429 7.28667C1.91814 8.71002 1.50146 10.3084 1.50146 12C1.50146 13.6917 1.91814 15.29 2.64429 16.7133L6.12046 14.0767Z"
          fill="#FBBC05"
        />
        <path
          d="M12.2141 5.55997C14.2259 5.55997 15.583 6.41163 16.3569 7.12335L19.3807 4.23C17.5236 2.53834 15.1069 1.5 12.2141 1.5C8.02353 1.5 4.40447 3.85665 2.64258 7.28662L6.10686 9.92332C6.97598 7.39166 9.38073 5.55997 12.2141 5.55997Z"
          fill="#EB4335"
        />
      </svg>
    ),
  },
  {
    id: 2,
    title: "Github",
    logo: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="30"
        height="30"
        viewBox="0 0 30 30"
      >
        <path d="M15,3C8.373,3,3,8.373,3,15c0,5.623,3.872,10.328,9.092,11.63C12.036,26.468,12,26.28,12,26.047v-2.051 c-0.487,0-1.303,0-1.508,0c-0.821,0-1.551-0.353-1.905-1.009c-0.393-0.729-0.461-1.844-1.435-2.526 c-0.289-0.227-0.069-0.486,0.264-0.451c0.615,0.174,1.125,0.596,1.605,1.222c0.478,0.627,0.703,0.769,1.596,0.769 c0.433,0,1.081-0.025,1.691-0.121c0.328-0.833,0.895-1.6,1.588-1.962c-3.996-0.411-5.903-2.399-5.903-5.098 c0-1.162,0.495-2.286,1.336-3.233C9.053,10.647,8.706,8.73,9.435,8c1.798,0,2.885,1.166,3.146,1.481C13.477,9.174,14.461,9,15.495,9 c1.036,0,2.024,0.174,2.922,0.483C18.675,9.17,19.763,8,21.565,8c0.732,0.731,0.381,2.656,0.102,3.594 c0.836,0.945,1.328,2.066,1.328,3.226c0,2.697-1.904,4.684-5.894,5.097C18.199,20.49,19,22.1,19,23.313v2.734 c0,0.104-0.023,0.179-0.035,0.268C23.641,24.676,27,20.236,27,15C27,8.373,21.627,3,15,3z"></path>
      </svg>
    ),
  },
];

export default function Home() {
  return (
    <div className="login w-full h-screen bg-base-100 grid grid-rows-[max-content_max-content_1fr] md:grid-rows-[initial] md:place-items-center md:grid-cols-[3fr_2fr]">
      <div className="w-full mt-10 flex justify-center p-5 md:pr-0 flex-wrap">
        <form
          className="relative w-[90%] pb-10 md:p-15  max-w-[40em] border-b-primary/50 border-b-2 md:border-b-0  after:left-[50%] after:top-full  md:border-r-primary/50 md:border-r-2 after:content-['OR'] after:absolute md:after:left-full md:after:top-[50%] after:translate-[-50%] after:w-10 after:h-10 after:bg-base-100 after:grid after:place-items-center after:text-sm"
          action={(formdata) => {
            const email = formdata.get("email");
            const password = formdata.get("password");
            signIn("credentials", { email, password });
          }}
        >
          <h2 className="text-center text-2xl ">
            Sign Up{" "}
            <input
              type="checkbox"
              style={{ "--input-color": "var(--color-base-content)" } as React.CSSProperties}
              className="toggle toggle-xl mx-5"
            />{" "}
            Log In
          </h2>
          <fieldset className="fieldset mt-8">
            <legend className="fieldset-legend font-normal tracking-wider">
              Email address
            </legend>
            <input
              type="email"
              name="email"
              className="input validator w-full"
              required
            />
            <p className="validator-hint hidden">
              Please enter valid email address
            </p>
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend font-normal tracking-wider">
              Password
            </legend>
            <label className="input validator w-full">
              <input
                type="password"
                name="password"
                required
                minLength={8}
                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
              />
            </label>
            <p className="validator-hint hidden  ">
              Must be more than 8 characters, including
              <br />
              At least one number <br />
              At least one lowercase letter <br />
              At least one uppercase letter
            </p>
          </fieldset>
          <button
            type="submit"
            className="btn btn-primary mt-7 w-full tracking-wider font-medium"
          >
            Log in
          </button>
        </form>
      </div>
      <div className="p-8 pl-3 md:mr-auto flex items-center justify-center md:justify-start flex-col gap-5">
        {oauthApplications.map((app) => {
          return (
            <button
              key={app.id}
              className="btn bg-base-100 border-3 px-11 py-2 font-normal tracking-wider rounded-2xl wrap-break-word h-auto w-auto"
            >
              {app.logo}
              Continue with {app.title}
            </button>
          );
        })}
      </div>
    </div>
  );
}
