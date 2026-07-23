import React from "react";
import { Bookmark } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Card2 = (props) => {
  const navigate = useNavigate();
  return (
    <div className="card">
      {/* Top Section */}
      <div className="top">
        <img className="logo" src={props.companyLogo} alt="" />

        <button className="save-btn">
          Save <Bookmark size={10} />
        </button>
      </div>

      {/* Company */}

      <div className="company">
        <h4>{props.companyName}</h4>
        <span>{props.posted}</span>
      </div>

      {/* Job Title */}

      <h2 className="job-title">{props.jobTitle}</h2>

      {/* Tags */}

      <div className="tags">
        <span>{props.tag2}</span>
      </div>

      <hr />

      {/* Bottom */}

      <div className="bottom">
        <div>
          <h3>{props.salary}</h3>

          <p>{props.location}</p>
        </div>

        <button
          className="apply-btn"
          onClick={() =>
            navigate(`/apply/${props.id}`, {
              state: props,
            })
          }
        >
          Apply Now
        </button>
      </div>
    </div>
  );
};

export default Card2;