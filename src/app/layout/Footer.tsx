// app/layout/Footer.tsx

const Footer = () => {
  return (
    <footer className="
      w-full
      bg-(--color-surface)
      border-t border-(--color-border)
    ">
      <div className="
        mx-auto max-w-7xl px-6 py-5
        flex flex-col sm:flex-row items-center justify-between gap-3
      ">

        {/* Branding */}
        <div className="flex items-center gap-2">
          <span className="
            w-2 h-2 rounded-full bg-[#137fec]
            shadow-[0_0_6px_rgb(19_127_236/0.6)]
          " />
          <span className="text-sm font-semibold text-(--color-text-primary) tracking-tight">
            SukmaPutra
          </span>
        </div>

        {/* Copy */}
        <p className="text-xs text-(--color-text-muted) text-center">
          Dibuat dengan{' '}
          <span className="text-[#137fec] font-medium">React</span>
          {' & '}
          <span className="text-[#137fec] font-medium">Firebase</span>
        </p>

        {/* Tech badges */}
        <div className="flex items-center gap-2">
          {['React', 'Firebase', 'TypeScript'].map((tech) => (
            <span
              key={tech}
              className="
                px-2.5 py-1 rounded-full text-xs font-medium
                bg-(--color-elevated)
                text-(--color-text-muted)
                border border-(--color-border)
              "
            >
              {tech}
            </span>
          ))}
        </div>

      </div>
    </footer>
  );
};

export default Footer;