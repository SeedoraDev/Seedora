interface TermsOfServiceProps {
    onBack: () => void
}

export default function TermsOfService({ onBack }: TermsOfServiceProps) {
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
                        Terms of <span className="font-normal">Service</span>
                    </h1>
                    <p className="text-white/60 text-sm">Last updated: November 26, 2024</p>
                </div>

                {/* Content */}
                <div className="space-y-8 text-white/80">
                    <section>
                        <h2 className="text-2xl font-light text-white mb-4">Acceptance of Terms</h2>
                        <p className="leading-relaxed">
                            By accessing and using Seedora's ThermoFoot service ("Service"), you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these Terms of Service, please do not use our Service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-light text-white mb-4">Medical Disclaimer</h2>
                        <p className="leading-relaxed">
                            Seedora provides AI-powered diabetic foot ulcer risk assessment as a screening tool. Our Service is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-light text-white mb-4">Use License</h2>
                        <div className="space-y-4">
                            <p className="leading-relaxed">
                                Permission is granted to temporarily use the Service for personal, non-commercial purposes. This license does not include:
                            </p>
                            <ul className="list-disc list-inside space-y-1 ml-4">
                                <li>Modifying or copying the Service materials</li>
                                <li>Using the materials for commercial purposes</li>
                                <li>Attempting to reverse engineer any software contained in the Service</li>
                                <li>Removing any copyright or proprietary notations</li>
                                <li>Transferring the materials to another person or "mirroring" the materials on any other server</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-light text-white mb-4">User Accounts</h2>
                        <p className="leading-relaxed">
                            When you create an account with us, you must provide accurate, complete, and current information. Failure to do so constitutes a breach of the Terms. You are responsible for safeguarding your account password and for any activities or actions under your account.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-light text-white mb-4">Intellectual Property</h2>
                        <p className="leading-relaxed">
                            The Service and its original content, features, and functionality are owned by Seedora and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-light text-white mb-4">Limitation of Liability</h2>
                        <p className="leading-relaxed">
                            In no event shall Seedora, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-light text-white mb-4">Accuracy of Results</h2>
                        <p className="leading-relaxed">
                            While we strive to provide accurate risk assessments using advanced AI technology, we do not guarantee the accuracy, completeness, or reliability of any analysis results. The Service should be used as a supplementary screening tool only.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-light text-white mb-4">Data Privacy</h2>
                        <p className="leading-relaxed">
                            Your use of the Service is also governed by our Privacy Policy. Please review our Privacy Policy to understand our practices regarding the collection and use of your information.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-light text-white mb-4">Termination</h2>
                        <p className="leading-relaxed">
                            We may terminate or suspend your account and access to the Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-light text-white mb-4">Changes to Terms</h2>
                        <p className="leading-relaxed">
                            We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-light text-white mb-4">Governing Law</h2>
                        <p className="leading-relaxed">
                            These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-light text-white mb-4">Contact Us</h2>
                        <p className="leading-relaxed">
                            If you have any questions about these Terms, please contact us at{' '}
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
