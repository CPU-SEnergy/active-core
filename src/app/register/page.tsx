// "use client";

// import { FormEvent, useState } from "react";
// import Link from "next/link";
// import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
// import { app } from "@/lib/firebaseClient";
// import { useRouter } from "next/navigation";
// import { z } from "zod";

// const registrationSchema = z.object({
//   email: z
//     .string()
//     .email("Please enter a valid email address.")
//     .nonempty("Email is required."),
//   password: z
//     .string()
//     .min(6, "Password must be at least 6 characters long.")
//     .nonempty("Password is required."),
//   confirmation: z
//     .string()
//     .min(6, "Confirmation password must be at least 6 characters long.")
//     .nonempty("Confirmation password is required."),
// }).refine(data => data.password === data.confirmation, {
//   message: "Passwords don't match",
//   path: ["confirmation"],
// });

// export default function Register() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmation, setConfirmation] = useState("");
//   const [error, setError] = useState("");
//   const router = useRouter();

//   async function handleSubmit(event: FormEvent) {
//     event.preventDefault();
//     setError("");  

//     try {
//       registrationSchema.parse({ email, password, confirmation });
//     } catch (e) {
//       if (e instanceof z.ZodError) {
//         setError(e.errors.map(err => err.message).join(" "));
//         return;
//       }
//     }

//     try {
//       await createUserWithEmailAndPassword(getAuth(app), email, password);
//       router.push("/login");
//     } catch (e) {
//       setError((e as Error).message);
//     }
//   }

//   return (
//     <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-cover bg-center" style={{ backgroundImage: "url('/pictures/sportsfitness.jpg')" }}>
//       <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
//         <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
//           <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
//             Create your account
//           </h1>
//           <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6" action="#">
//             <div>
//               <label
//                 htmlFor="email"
//                 className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
//               >
//                 Email
//               </label>
//               <input
//                 type="email"
//                 name="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 id="email"
//                 className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
//                 placeholder="name@company.com"
//                 required
//               />
//             </div>
//             <div>
//               <label
//                 htmlFor="password"
//                 className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
//               >
//                 Password
//               </label>
//               <input
//                 type="password"
//                 name="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 id="password"
//                 placeholder="••••••••"
//                 className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
//                 required
//               />
//             </div>
//             <div>
//               <label
//                 htmlFor="confirm-password"
//                 className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
//               >
//                 Confirm password
//               </label>
//               <input
//                 type="password"
//                 name="confirm-password"
//                 value={confirmation}
//                 onChange={(e) => setConfirmation(e.target.value)}
//                 id="confirm-password"
//                 placeholder="••••••••"
//                 className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
//                 required
//               />
//             </div>
//             {error && (
//               <div
//                 className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
//                 role="alert"
//               >
//                 <span className="block sm:inline">{error}</span>
//               </div>
//             )}
//             <button
//               type="submit"
//               className="w-full text-white bg-gray-600 hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-primary-800"
//             >
//               Create an account
//             </button>
//             <p className="text-sm font-light text-gray-500 dark:text-gray-400">
//               Already have an account?{" "}
//               <Link
//                 href="/login"
//                 className="font-medium text-gray-600 hover:underline dark:text-gray-500"
//               >
//                 Login here
//               </Link>
//             </p>
//           </form>
//         </div>
//       </div>
//     </main>
//   );
// }




"use client"

import { FormEvent, useState } from "react"
import Link from "next/link"
import { z } from "zod"

const registrationSchema = z.object({
    email: z
      .string()
      .email("Please enter a valid email address.")
      .nonempty("Email is required."),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters long.")
      .nonempty("Password is required."),
    confirmation: z
      .string()
      .min(6, "Confirmation password must be at least 6 characters long.")
      .nonempty("Confirmation password is required."),
  })
  .refine((data) => data.password === data.confirmation, {
    message: "Passwords don't match",
    path: ["confirmation"],
  })

export default function Register() {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmation, setConfirmation] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [dob, setDob] = useState("")
  const [sex, setSex] = useState("")
  const [error, setError] = useState("")

  const handleNextStep = (event: FormEvent) => {
    event.preventDefault()
    setError("")

    try {
      if (step === 1) {
        registrationSchema.parse({ email, password, confirmation })
        setStep(2)
      }
    } catch (e) {
      if (e instanceof z.ZodError) {
        setError(e.errors.map((err) => err.message).join(" "))
      }
    }
  }

  const handleSignUp = (event: FormEvent) => {
    event.preventDefault()
    setError("")
    console.log({ firstName, lastName, phoneNumber, dob, sex })
    alert("Registration completed!")
  }

  return (
    <main
      className="flex min-h-screen items-center justify-center bg-cover bg-center p-4"
      style={{ backgroundImage: "url('/pictures/sportsfitness.jpg')" }}
    >
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <div className="mb-4 flex justify-center">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-6">
              <div className="flex items-center">
                <div className={`flex h-5 w-5 items-center justify-center rounded-full ${
                  step === 1 ? "border-2 border-gray-900 text-gray-900 font-bold" : "border border-gray-300 text-gray-400"
                }`}>
                  <span className="text-xs">1</span>
                </div>
                <span className={`ml-2 text-sm ${step === 1 ? "text-gray-900 font-medium" : "text-gray-400"}`}>
                  Register
                </span>
              </div>
              <span className="text-gray-400">→</span>
              <div className="flex items-center">
                <div className={`flex h-5 w-5 items-center justify-center rounded-full ${
                  step === 2 ? "border-2 border-gray-900 text-gray-900 font-bold" : "border border-gray-300 text-gray-400"
                }`}>
                  <span className="text-xs">2</span>
                </div>
                <span className={`ml-2 text-sm ${step === 2 ? "text-gray-900 font-medium" : "text-gray-400"}`}>
                  Information
                </span>
              </div>
            </div>
            <div className="flex w-full">
              <div className="flex-1 relative">
                <div className={`absolute bottom-[-4px] left-0 h-[2px] ${step === 1 ? "bg-red-500" : "bg-transparent"}`} style={{width: 'calc(100% - 8px)'}} />
              </div>
              <div className="w-4" />
              <div className="flex-1 relative">
                <div className={`absolute bottom-[-4px] left-[8px] h-[2px] ${step === 2 ? "bg-red-500" : "bg-transparent"}`} style={{width: '100%'}} />
              </div>
            </div>
          </div>
        </div>

        {step === 1 && (
          <div>
            <h2 className="mb-2 text-center text-xl font-semibold">Sign up to Sports and Fitness</h2>
            <p className="mb-4 text-center text-sm text-gray-500">Create your account</p>
            <form onSubmit={handleNextStep} className="space-y-4">
              <div>
                <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-md border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Input text"
                />
              </div>
              <div>
                <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-md border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Input text"
                />
              </div>
              <div>
                <label htmlFor="confirm-password" className="mb-1 block text-sm font-medium text-gray-700">
                  Confirm password
                </label>
                <input
                  type="password"
                  id="confirm-password"
                  value={confirmation}
                  onChange={(e) => setConfirmation(e.target.value)}
                  className="w-full rounded-md border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Input text"
                />
              </div>
              {error && <p className="text-center text-sm text-red-500">{error}</p>}
              <button
                type="submit"
                className="w-full rounded-md bg-red-500 py-2 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Next
              </button>
            </form>
            <p className="mt-4 text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold hover:text-blue-400 hover:underline">
                Login
              </Link>
            </p>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="mb-2 text-center text-xl font-semibold">Sign up to Sports and Fitness</h2>
            <p className="mb-4 text-center text-sm text-gray-500">Complete your account details</p>
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <label htmlFor="first-name" className="mb-1 block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  type="text"
                  id="first-name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full rounded-md border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Input text"
                />
              </div>
              <div>
                <label htmlFor="last-name" className="mb-1 block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  type="text"
                  id="last-name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full rounded-md border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Input text"
                />
              </div>
              <div>
                <label htmlFor="phone" className="mb-1 block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="text"
                  id="phone"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full rounded-md border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Input text"
                />
              </div>
              <div className="flex space-x-2">
                <div className="flex-1">
                  <label htmlFor="dob" className="mb-1 block text-sm font-medium text-gray-700">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    id="dob"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full rounded-md border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="sex" className="mb-1 block text-sm font-medium text-gray-700">
                    Sex
                  </label>
                  <input
                    type="text"
                    id="sex"
                    value={sex}
                    onChange={(e) => setSex(e.target.value)}
                    className="w-full rounded-md border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Input text"
                  />
                </div>
              </div>
              {error && <p className="text-center text-sm text-red-500">{error}</p>}
              <button
                type="submit"
                className="w-full rounded-md bg-red-500 py-2 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Sign up
              </button>
            </form>
            <p className="mt-4 text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold hover:text-blue-400 hover:underline">
                Login
              </Link>
            </p>
          </div>
        )}
      </div>
    </main>
  )
}