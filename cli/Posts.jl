module Posts

using Dates
using Printf
using Markdown

export create_from_markdown, sitemap

const base = "posts"

"""create_from_markdown creates a new post based on a markdown file as the
given input. this function makes the following assumptions:

- the file ends in `.md`
- the file name only contains utf8 characters, separated by underscores.
- the file will not be deleted or moved
"""
function create_from_markdown(arguments)
        if length(arguments) > 1
                filename = join(arguments[2])
        end
        
        doc = Markdown.parse_file(filename)

        filename = replace(filename, ".md" => ".html")

        # convert the y, m, d Int64 tuple to strings
        y, m, d = [string(i) for i in yearmonthday(now())]
        # join the path
        path = joinpath(base, y, m, d)

        # create it if necessary
        mkpath(path)

        # touch the new file inside it

        file = joinpath(path, splitdir(filename)[2])

        if isfile(file)
                @printf("%s: already exists\n", filename)
                exit(1)
        end

        header = read("cli/header.html", String)
        body = html(doc)
        footer = read("cli/footer.html", String)

        document = header * body * footer

        write(file, document)
end

"""sitemap builds a `map.html` file containing an unordered list.
Each element in the list is a valid path to a file on disk,
representing a post."""
function sitemap(arguments)
        if length(arguments) < 2 || length(arguments) > 2
                println(stderr, "expected only one argument (directory to map)")
                exit(1)
        end
        dir = arguments[2]
        if !isdir(dir)
            println(stderr, "expected a directory")
            exit(1)
        end

        list = """<link rel="stylesheet" href="/css/main.css">
        <base target="_parent">
        <ul>"""
        close = "\n</ul>"

        posts = []
        for (root, dirs, files) in walkdir(dir)
                for file in files

                    # infer the file name
                    fname = begin
                            f = split(file, "_")
                            f = [uppercasefirst(x) for x in f]
                            f = join(f, " ")
                            f = replace(f, ".html" => "")
                    end

                    # create the html formatted link
                    list_item = @sprintf("\n\t<li><a href=\"%s\">%s</a></li>", joinpath(root, file), fname)

                    # push the items onto the posts array
                    push!(posts, list_item)
                end
        end

        # sort the items upside down
        #  -> latest post on top
        reverse!(posts)

        # append all items to the list
        for item in posts
            list = list * item
        end

        # then close
        list = list * close

        write("map.html", list)
end

end