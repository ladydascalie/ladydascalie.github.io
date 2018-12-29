#!/usr/bin/env julia

using Printf

include("Posts.jl")

const md = "--markdown"
const sitemap = "--sitemap"

const usage = """
        [cli] - Publishing Helper.

        commands:
        [$md]
                - Create a new post, using a Markdown file as input.
        
        [$sitemap]
                - Create a sitemap, reading the posts directory.
        """

"die - compact helper function for early exits"
die() = (println(usage);exit(2))

"dispatch - checks for a cli flag match, then call the appropriate method, or die"
function dispatch(s::String)
    if s == sitemap
        Posts.sitemap(ARGS)
    elseif s == md
        Posts.create_from_markdown(ARGS)
    else
        die()
    end
end

# entry point
if length(ARGS) > 0
    dispatch(ARGS[1])
else
    die()
end