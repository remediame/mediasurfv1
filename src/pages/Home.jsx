import { Link } from "react-router";
import Navbar from "./Navbar";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import AuthPage from "./auth/AuthPage";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const Home = () => {
  const [user, setUser] = useState(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mediaType, setMediaType] = useState("images");
  const [authModal, setAuthModal] = useState(false);
  const userId = sessionStorage.getItem("user_id");
  const [filterTag, setFilterTag] = useState("");

  const openAuthModal = () => setAuthModal(true);
  const closeAuthModal = () => setAuthModal(false);

  useEffect(() => {
    const session = supabase.auth.getSession();
    setUser(session?.user || null);
  }, []);

  useEffect(() => {
    if (query.trim()) {
      searchMedia();
    }
  }, [mediaType]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    sessionStorage.setItem("user_id", "");
  };

  const searchMedia = async () => {
    if (!userId) {
      openAuthModal();
      return;
    }

    setLoading(true);
    const response = await fetch(
      `https://api.openverse.org/v1/${mediaType}?q=${query}`
    );
    const data = await response.json();
    setResults(data.results || []);
    setLoading(false);

    const { error } = await supabase
      .from("MediaSurfv1")
      .upsert([{ user_id: userId, query }]);
    if (error) {
      console.error("Upload error", error);
    }
  };

  const filteredResults = filterTag
    ? results.filter(
        (item) =>
          item.tags &&
          item.tags.some(
            (tagObj) => tagObj.name.toLowerCase() === filterTag.toLowerCase()
          )
      )
    : results;

  const allTags = [
    ...new Set(
      results
        .filter((item) => item.tags && Array.isArray(item.tags))
        .flatMap((item) => item.tags.map((tagObj) => tagObj.name.toLowerCase()))
    ),
  ];

  return (
    <div className="container-fluid">
      <Navbar
        user={user}
        handleLogout={handleLogout}
        openAuthModal={openAuthModal}
      />

      <div className="container p-3">
        <div className="card p-3 shadow my-4">
          <h5 className="text-primary">Content Type </h5>
          <div className="d-flex">
            <div className="search-radio me-3">
              <label>Sound</label>
              <input
                type="radio"
                name="mediaType"
                checked={mediaType === "audio"}
                onChange={() => setMediaType("audio")}
              />
            </div>
            <div className="search-radio">
              <label>Images</label>
              <input
                type="radio"
                name="mediaType"
                checked={mediaType === "images"}
                onChange={() => setMediaType("images")}
              />
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-center">
          <input
            type="search"
            className="form-control"
            placeholder="Enter keyword or tag"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            className="border-0 bg-none rounded ms-2 px-4"
            onClick={searchMedia}
            role="submit"
          >
            <i className="bi bi-search "></i>
          </button>
        </div>

        <div className="search-results text-center my-3">
          <b className="fs-4 text-primary">Search Results</b>
          <hr />
          {mediaType === "images" && allTags.length > 0 && (
            <div className="tag-row mb-3 d-flex flex-wrap gap-2">
              {allTags.map((tag, i) => (
                <button
                  key={i}
                  className={`btn btn-sm ${
                    filterTag === tag ? "btn-primary" : "btn-outline-primary"
                  }`}
                  onClick={() => setFilterTag(tag === filterTag ? "" : tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}

          {filterTag && (
            <button
              className="btn btn-sm btn-danger ms-2"
              onClick={() => setFilterTag("")}
            >
              Clear Filter
            </button>
          )}

          {loading && (
            <div className="text-center my-3 ">
              <span className="spinner-border" role="status"></span>
            </div>
          )}
          <div className="row row-cols-1 row-cols-md-3 row-cols-xl-4 g-3">
            {filteredResults.map((item, index) => (
              <div className="col" key={index}>
                {mediaType === "images" ? (
                  <div className="card">
                    <img src={item.url} className="card-img-top" alt="..." />
                    <div className="card-body">
                      <h5 className="card-title">{item.title}</h5>
                      <div className="d-block">
                        <button className="btn bg-primary-subtle me-2">
                          {item.provider}
                        </button>

                        <Link to={item.foreign_landing_url}>
                          <button className="btn btn-outline-primary">
                            External Link
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="card p-3">
                    <div className="card-body">
                      <h5 className="card-title">{item.title}</h5>
                      <p className="text-muted">
                        By:{" "}
                        <a
                          href={item.creator_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {item.creator}
                        </a>
                      </p>
                      <audio controls className="w-100">
                        <source src={item.url} type="audio/wav" />
                        Your browser does not support the audio element.
                      </audio>
                      <p className="small mt-2">
                        License:{" "}
                        <a
                          href={item.license_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {item.license}
                        </a>
                      </p>
                      <a
                        href={item.foreign_landing_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline-primary mt-2"
                      >
                        View Source
                      </a>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <AuthPage show={authModal} handleClose={closeAuthModal} />
    </div>
  );
};

export default Home;
