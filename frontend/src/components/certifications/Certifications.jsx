import { useState, useRef } from 'react';
import { useInView, motion } from 'framer-motion';
import { SectionHeader, Button } from '../common';

export function CertificationsSection() {
  const [openPdf, setOpenPdf] = useState(null);

  const certs = [
    {
      id: 'deloitte-tech-sim',
      title: 'Deloitte Australia - Technology Job Simulation',
      file: '/assets/certs/Deloitte_Australia.pdf',
      org: 'Forage',
      issued: 'Dec 2025',
    },
    {
      id: 'aws-solutions-arch-sim',
      title: 'AWS - Solutions Architecture Job Simulation',
      file: '/assets/certs/AWS_SolutionsArchitecture.pdf',
      org: 'Forage',
      issued: 'Dec 2025',
    },
    {
      id: 'ea-se-sim',
      title: 'Electronic Arts - Software Engineering Job Simulation',
      file: '/assets/certs/EA_SoftwareEngineering.pdf',
      org: 'Forage',
      issued: 'Dec 2025',
    },
  ];

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="certifications" ref={ref} className="py-20 lg:py-28 bg-background/0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader label="Credentials" title="Certifications & Job Simulations" description="Selected professional simulations and certificates." animate isInView={isInView} />

        <style>{`
          .cert-card { transition: transform 220ms ease, box-shadow 220ms ease; }
          .cert-card:hover { transform: translateY(-6px); box-shadow: 0 12px 30px rgba(13, 60, 120, 0.12); }
          .jewel-icon { transition: transform 260ms cubic-bezier(.2,.9,.3,1), box-shadow 260ms ease; cursor: pointer; }
          .jewel-icon:hover { transform: translateY(-4px) scale(1.06) rotate(-6deg); box-shadow: 0 6px 18px rgba(14, 109, 230, 0.14); }
          .show-creds-btn { transition: transform 220ms cubic-bezier(.2,.9,.3,1), box-shadow 220ms ease; }
          .show-creds-btn:hover { transform: translateY(-6px) scale(1.06); box-shadow: 0 14px 36px rgba(14,109,230,0.14); }
        `}</style>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {certs.map((c, idx) => (
            <motion.div
              key={c.id}
              className={`cert-card rounded-lg p-4 flex flex-col justify-between bg-card/60 border border-border`}
              initial={{ opacity: 0, y: 18 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.08 * idx }}
            >
              <div className="flex items-start gap-3">
                <button
                  type="button"
                  onClick={() => setOpenPdf(c.file)}
                  aria-label={`Open ${c.title}`}
                  className="p-0 bg-transparent border-0"
                >
                  <div
                    className="w-10 h-10 rounded-md flex items-center justify-center text-white shadow-sm jewel-icon"
                    style={{ backgroundImage: 'var(--cert-icon-gradient)', backgroundColor: 'var(--color-accent)' }}
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <path d="M12 2l4 6 6 2-6 8-4 6-4-6-6-8 6-2 4-6z" />
                    </svg>
                  </div>
                </button>

                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="text-sm font-semibold">{c.title}</div>
                    <div
                      className="text-xs rounded-full px-2 py-0.5 font-semibold text-white shadow-sm"
                      style={{ backgroundImage: 'var(--cert-badge-gradient)', backgroundColor: 'var(--color-accent)' }}
                    >{c.org}</div>
                  </div>
                  <div className="text-xs text-muted mt-1">Issued: {c.issued}</div>
                </div>
              </div>

              <div className="mt-4">
                <Button
                  variant="outline"
                  animate
                  className="show-creds-btn"
                  onClick={() => setOpenPdf(c.file)}
                  icon={<svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M6 2h7l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
                  </svg>}
                >
                  Show Your Credential
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      {openPdf && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-[92vw] max-w-5xl h-[86vh] bg-background rounded-md overflow-hidden border border-border">
            <div className="p-3 flex items-center justify-between relative" style={{ background: 'var(--color-card)' }}>
              <div className="absolute left-0 right-0 top-0 h-1" style={{ backgroundImage: 'var(--cert-badge-gradient)' }} />
              <div className="text-sm font-medium">Credential Preview</div>
              <div>
                <Button variant="ghost" onClick={() => setOpenPdf(null)}>
                  Close
                </Button>
              </div>
            </div>
            <iframe src={openPdf} title="Credential" className="w-full h-full bg-white" />
          </div>
        </div>
      )}
    </section>
  );
}

export default CertificationsSection;
