import { APP_PROJECT_URL } from '@/config';

function VersionInfo() {
  return (
    <div className="px-2 text-center text-xs">
      <span title="当前版本" className="cursor-pointer opacity-80 hover:opacity-100">
        v1.0.5
      </span>
      <span className="mx-1 opacity-80">·</span>
      <a
        href={APP_PROJECT_URL}
        target="_blank"
        className="cursor-pointer opacity-80 hover:opacity-100"
      >
        GitHub
      </a>
      <span className="mx-1 opacity-80">·</span>
      <span className="cursor-pointer opacity-80 hover:opacity-100">投喂</span>
    </div>
  );
}

export default VersionInfo;
