import { Ban } from "./Foxxie/Ban";
import { InfoUser } from "./Foxxie/InfoUser";
import { Wolfram } from "./Kettu/Wolfram";
import Divider from '@mui/material/Divider';
import { Pokemon } from "./Kettu/Pokemon";
import { Log } from "./Foxxie/Log";
import { motion } from 'framer-motion';
import { useRouter } from "next/router";

const features = [
    {
        name: 'Moderation',
        Feature: Ban,
        description: 'Foxxie comes with extensive moderation features, including the basic ones you\'d expect.',
        bot: 'Foxxie',
        link: '/foxxie/guides/moderation'
    },
    {
        name: 'Basic tools',
        Feature: Wolfram,
        description: 'Kettu has a bunch of tools that can help you, like a color command, image generation and wolfram.',
        bot: 'Kettu',
        link: '/kettu/guides/tools'
    },
    {
        name: 'Information',
        Feature: InfoUser,
        description: 'Foxxie has information about anything in your server, from users to roles, even channels and emojis!',
        bot: 'Foxxie',
        link: '/foxxie/guides/information'
    },
    {
        name: 'Websearch',
        Feature: Pokemon,
        description: 'Kettu includes multiple websearch features, including Pokémon, Animal Crossing, Github, and more.',
        bot: 'Kettu',
        link: '/kettu/guides/websearch'
    },
    {
        name: 'Logging',
        Feature: Log,
        description: 'Foxxie uses a highly customized logging system. With members, moderation, messages and much more.',
        bot: 'Foxxie',
        link: '/foxxie/guides/logging'
    }
];

export function Features() {
    const router = useRouter();
    return (
        <div className='mt-40'>
            {
                features.map(({ name, Feature, description, bot, link }, i) => {
                    const isOdd = i % 2;
                    return (
                        <motion.div
                            key={name}
                            initial={isOdd ? { x: 20, opacity: 0 } : { x: -20, opacity: 0 }}
                            animate={{
                                ...isOdd ? { x: 0 } : { x: 0 },
                                opacity: 1,
                                transition: {
                                    duration: 0.4,
                                    delay: 0.3 + (i / 100 + 0.05) * 5,
                                    ease: [0.48, 0.15, 0.25, 0.96]
                                }
                            }}
                            className={`p-5 md:block lg:block xl:block sm:hidden hidden ${isOdd ? 'mt-20' : 'mt-20'}`}
                        >
                            <div className='flex flex-row odd:flex-row-reverse min-h-min items-center content-center justify-around'>
                                {
                                    !isOdd &&
                                    <div className='md:hidden hidden sm:hidden lg:block xl:block'>
                                        <Feature />
                                    </div>
                                }
                                <div className='flex-col xl:w-6/12 lg:w-6/12 md:w-full flex w-full mb-4 mx-6'>
                                    <h1
                                        className='font-bold font-source-sans text-xl md:text-3xl p-2 text-white'
                                    >
                                        <button
                                            className="font-bold"
                                            onClick={() => {
                                                return router.push(link);
                                            }}
                                        >
                                            <span className='hover:mr-3 hover:underline duration-700 font-source-sans'>
                                                {name}{' '}&rsaquo;
                                            </span>
                                            <span>
                                                {' '}{bot}
                                            </span>
                                        </button>
                                    </h1>

                                    <p className='font-semibold font-source-sans text-light-white mb-2 text-sm'>
                                        {description}
                                    </p>
                                </div>
                                {
                                    isOdd ?
                                    <div className='md:hidden hidden sm:hidden lg:block xl:block'>
                                        <Feature />
                                    </div>
                                    : null
                                }
                            </div>

                            <Divider />

                        </motion.div>
                    );
                })
            }
        </div>
    );
}
