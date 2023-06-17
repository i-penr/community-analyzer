import { FC, useState } from 'react';
import { useFetch } from './customHooks/useFetch';
import { IWidget } from './interfaces/IWidget';
import './css/subinfo.css'

export const SubInfo: FC<IWidget> = ({ sub }) => {
    const { data: subData, error: subError }: any = useFetch(`http://localhost:8080/subs/get/${sub}`);
    const { data: oldestPost }: any = useFetch(`http://localhost:8080/posts/latest/${sub}&${-1}`);
    const { data: newestPost }: any = useFetch(`http://localhost:8080/posts/latest/${sub}&${1}`);
    const { data: numPosts }: any = useFetch(`http://localhost:8080/posts/count/${sub}`);
    const [hideButtonValue, setHideButtonValue] = useState('Show More');
    const [isHidden, setIsHidden] = useState(true);
    const subColor = subData.primary_color;

    function toggleHide() {
        setIsHidden(prevValue => !prevValue);
        setHideButtonValue(prevValue => (prevValue === 'Show More' ? 'Show Less' : 'Show More'));
    };

    return (
        <div className='SubInfo'>
            {subColor && <div className='subColor py-2' style={{ background: subColor }} />}
            {!subError && subData && (
                <>
                    {
                        <div className='block1 py-4'>
                            {subData.header_img &&
                                <img
                                    className='icon image-fluid'
                                    alt={`${subData.display_name_prefixed}'s icon`}
                                    src={subData.header_img}
                                />}

                            <h1 className='title'>{subData.display_name_prefixed}</h1>

                            <div className='row justify-content-center fs-6'>
                                {subData.subscribers &&
                                    <div className='col-3 border border-primary'>
                                        <strong>{subData.subscribers.toLocaleString()}</strong> Members
                                    </div>
                                }
                                {subData.active_user_count &&
                                    <div className='col-3 border border-primary'>
                                        <strong>{subData.active_user_count.toLocaleString()}</strong> Online
                                    </div>
                                }
                            </div>
                        </div>}

                    { numPosts.numPosts && 
                        <div>
                            <h5 className='text-primary'>Number of posts in database</h5>
                            <p>{ numPosts.numPosts.toLocaleString() } posts</p>
                        </div>
                    }

                    {subData.public_description &&
                        <div className='w-100 px-5 py-2'>
                            <h6 className='text-primary text-start fw-bold'>Description</h6>
                            <p className='description clearfix text-start'>{subData.public_description}</p>
                        </div>
                    }

                    <div className='created border border-primary rounded mx-5 my-2'>
                        <table className='dates table table-sm table-borderless my-2'>
                            <thead>
                                <tr className='text-primary'>
                                    <th>Oldest Registered Post Date</th>
                                    <th>Subreddit Creation Date</th>
                                    <th>Newest Registered Post Date</th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr>
                                    <td>{newestPost && new Date(newestPost.created_utc * 1000).toDateString()}</td>
                                    <td>{new Date(subData.created_utc * 1000).toDateString()}</td>
                                    <td>{oldestPost && new Date(oldestPost.created_utc * 1000).toDateString()}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="links">
                        <div className='w-100 px-5 py-2'>
                            <h6 className='text-primary text-start fw-bold'>Wiki</h6>
                            {subData.wiki_enabled && <p className='wiki text-start'>
                                <a href={`https://www.reddit.com/r/${subData.subreddit}/wiki/index/`}>
                                    Enabled
                                </a>
                            </p>
                            }
                            {!subData.wiki_enabled && <p className='wiki text-start'>Disabled</p>}
                        </div>
                    </div>

                    <div className='less-relevant my-4 mx-5' id='hideable' style={{ display: isHidden ? 'none' : 'block' }}>
                        <div>
                            <table className='table table-sm table-borderless'>
                                <thead className='text-primary'>
                                    <tr>
                                        <th>NSFW</th>
                                        <th>Type</th>
                                        <th>Submission type</th>
                                        <th>Spoilers</th>
                                        <th>Is quarantined</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    <tr>
                                        <td>{booleanToYesNo(subData.over18)}</td>
                                        <td>{subData.subreddit_type}</td>
                                        <td>{subData.submission_type}</td>
                                        <td>{booleanToYesNo(subData.spoilers_enabled)}</td>
                                        <td>{booleanToYesNo(subData.quarantine)}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div>
                            <table className='table table-sm table-borderless'>
                                <thead className='text-primary'>
                                    <tr>
                                        <th>Allows images</th>
                                        <th>Allows polls</th>
                                        <th>Allows predictions</th>
                                        <th>Allows tasks</th>
                                        <th>Allows videos</th>
                                        <th>Allows gifs</th>
                                        <th>All original content</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    <tr>
                                        <td>{booleanToYesNo(subData.allow_images)}</td>
                                        <td>{booleanToYesNo(subData.allow_polls)}</td>
                                        <td>{booleanToYesNo(subData.allow_predictions)}</td>
                                        <td>{booleanToYesNo(subData.allow_tasks)}</td>
                                        <td>{booleanToYesNo(subData.allow_videos)}</td>
                                        <td>{booleanToYesNo(subData.allow_gifs)}</td>
                                        <td>{booleanToYesNo(subData.all_original_content)}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div>
                            <table className='table table-sm table-borderless'>
                                <thead className='text-primary'>
                                    <tr>
                                        <th>Allowed media in comments</th>
                                        <th>Shows media preview</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    <tr>
                                        <td>{subData.allowed_media_in_comments && subData.allowed_media_in_comments.toString()}</td>
                                        <td>{booleanToYesNo(subData.show_media_preivew)}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <button className={'btn text-primary'} onClick={() => toggleHide()}>{hideButtonValue}</button>
                </>
            )}
        </div>
    );
}

function booleanToYesNo(b: boolean) {
    return b ? 'Yes' : 'No';
}