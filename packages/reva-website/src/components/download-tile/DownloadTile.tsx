export const DownloadTile = ({
  name,
  description,
  url,
  mimeType,
  fileSizeInBytes,
  onUrlClick,
}: {
  name: string;
  description?: string;
  url: string;
  mimeType: string;
  fileSizeInBytes?: number;
  onUrlClick?: () => void;
}) => {
  return (
    <div className="fr-tile fr-tile--download fr-enlarge-link h-full">
      <div className="fr-tile__body">
        <div className="fr-tile__content">
          <h3 className="fr-tile__title">
            <a href={url} target="_blank" onClick={onUrlClick}>
              {name}
            </a>
          </h3>
          {description && (
            <p className="fr-card__desc text-base">{description}</p>
          )}

          <div className="fr-card__end">
            <p className="fr-tile__detail">
              {mimeType.split("/").pop()?.toUpperCase()}
              {fileSizeInBytes &&
                ` - ${
                  fileSizeInBytes > 1024 * 1024
                    ? `${(fileSizeInBytes / (1024 * 1024)).toFixed(2)} Mo`
                    : `${(fileSizeInBytes / 1024).toFixed(2)} Ko`
                }`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
