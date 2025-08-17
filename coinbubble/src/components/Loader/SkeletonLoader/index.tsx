import './styles.scss';

const SkeletonLoader = () => {
  return (
    <div className="SkeletonLoaderContainer">
      {Array(7).fill(0).map((_, index) => (
        <div key={index} className="SkeletonUserData">
          <div className="SkeletonRank" />
          <div className="SkeletonUserProfile" />
          <div className="SkeletonUserPoints" />
          <div className="SkeletonMedal" />
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;