import { useState } from "react";
import PlaidButton from "./components/PlaidButton";
import { Lock, Shield, Zap } from "lucide-react";

function Plaid_Link() {
  const [user, setUser] = useState<"connected" | null>("connected");
  const [view, setView] = useState<"transactions" | "recurring" | "calendar">(
    "transactions"
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-blue-50">
      {/* Header */}
      <div className="container mx-auto px-4 pt-4">
        <div className="text-center mb-8">
          <span className="inline-flex items-center px-3 py-1 mb-4 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold">
            <Zap className="w-3 h-3 mr-1" />
            Secure Setup
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Welcome to
            <span className="bg-gradient-to-r from-blue-600 to-blue-600 bg-clip-text text-transparent">
              {" "}
              Mast Calendar
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Connect your bank account securely to unlock powerful financial
            insights and take control of your money.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-2">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-center gap-12 items-center">
            {/* Left Column - Connection Card */}
            <div className=" w-2xl">
              <div className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm rounded-lg p-8">
                <div className="text-center pb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Connect Your Account
                  </h2>
                  <p className="text-gray-600 text-base">
                    We use bank-level security to protect your information. Your
                    credentials are never stored.
                  </p>
                </div>
                <div className="space-y-6">
                  <PlaidButton setUser={setUser} />

                  <div className="text-center">
                    <p className="text-sm text-gray-500 mb-4">
                      Powered by Plaid - trusted by millions
                    </p>
                    <div className="flex items-center justify-center space-x-4 text-xs text-gray-400">
                      <div className="flex items-center">
                        <Lock className="w-3 h-3 mr-1" />
                        256-bit SSL
                      </div>
                      <div className="flex items-center">
                        <Shield className="w-3 h-3 mr-1" />
                        Bank-level security
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Plaid_Link;
