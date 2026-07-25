import "./StatsCard.css";

export default function StatsCard({
    title,
    value,
    icon,
}){

    return (

        <article className="stats-card">
            
            <div className="stats-card__icon">

                {icon}


            </div>

            <div className="stats-card__content">

                <p className="stats-card__title">
                    
                    {title}

                </p>

                <h2 className="stats-card__value">

                    {value}

                </h2>

            </div>

        </article>
    );
}