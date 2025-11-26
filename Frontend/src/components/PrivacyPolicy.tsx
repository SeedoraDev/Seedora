interface PrivacyPolicyProps {
    onBack: () => void
}

export default function PrivacyPolicy({ onBack }: PrivacyPolicyProps) {
    return (
        <div className="min-h-screen bg-black text-white">
            <div className="max-w-4xl mx-auto px-4 py-12">
                {/* Back Button */}
                <button
                    onClick={onBack}
                    className="flex items-center text-white/70 hover:text-white transition-colors mb-8 group"
                >
                    <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Home
                </button>

                {/* Header */}
                <div className="border-l-2 border-white pl-6 mb-12">
                    <h1 className="text-4xl font-light text-white mb-2">
                        Privacy <span className="font-normal">Policy</span>
                    </h1>
                    <p className="text-white/60 text-sm">Last updated: November 26, 2024</p>
                </div>

                {/* Content */}
                <div className="space-y-8 text-white/80">
                    <section>
                        <h2 className="text-2xl font-light text-white mb-4">Introduction</h2>
                        <p className="leading-relaxed">
                            Seedora ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our ThermoFoot diabetic foot ulcer detection service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-light text-white mb-4">Information We Collect</h2>
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-medium text-white mb-2">Personal Information</h3>
                                <p className="leading-relaxed">
                                    We may collect personal information that you provide to us, including but not limited to:
                                </p>
                                <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                                    <li>Name and contact information</li>
                                    <li>Medical information (patient details, doctor information)</li>
                                    <li>Account credentials</li>
                                    <li>Payment information (if applicable)</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-lg font-medium text-white mb-2">Medical Data</h3>
                                <p className="leading-relaxed">
                                    When you use our service, we collect thermogram images and analysis results for the purpose of diabetic foot ulcer risk assessment.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-lg font-medium text-white mb-2">Usage Data</h3>
                                <p className="leading-relaxed">
                                    We automatically collect certain information about your device and how you interact with our service, including IP address, browser type, and usage patterns.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-light text-white mb-4">How We Use Your Information</h2>
                        <p className="leading-relaxed mb-3">We use the information we collect to:</p>
                        <ul className="list-disc list-inside space-y-1 ml-4">
                            <li>Provide and maintain our diabetic foot ulcer detection service</li>
                            <li>Process and analyze thermogram images</li>
                            <li>Improve our AI models and service quality</li>
                            <li>Communicate with you about your account and service updates</li>
                            <li>Ensure the security and integrity of our platform</li>
                            <li>Comply with legal obligations</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-light text-white mb-4">Data Security</h2>
                        <p className="leading-relaxed">
                            We implement appropriate technical and organizational security measures to protect your personal information. However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-light text-white mb-4">Data Retention</h2>
                        <p className="leading-relaxed">
                            We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-light text-white mb-4">Your Rights</h2>
                        <p className="leading-relaxed mb-3">You have the right to:</p>
                        <ul className="list-disc list-inside space-y-1 ml-4">
                            <li>Access your personal information</li>
                            <li>Correct inaccurate or incomplete data</li>
                            <li>Request deletion of your personal information</li>
                            <li>Object to or restrict certain processing activities</li>
                            <li>Data portability</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-light text-white mb-4">Third-Party Services</h2>
                        <p className="leading-relaxed">
                            We may use third-party service providers to help us operate our service. These providers have access to your personal information only to perform specific tasks on our behalf and are obligated to protect your information.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-light text-white mb-4">Changes to This Policy</h2>
                        <p className="leading-relaxed">
                            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-light text-white mb-4">Contact Us</h2>
                        <p className="leading-relaxed">
                            If you have any questions about this Privacy Policy, please contact us at{' '}
                            <a href="mailto:support@seedora.com" className="text-blue-400 hover:text-blue-300 transition-colors">
                                support@seedora.com
                            </a>
                        </p>
                    </section>
                </div>
            </div>
        </div>
    )
}
