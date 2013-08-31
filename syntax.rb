class User
	:name

	def initialize( attributes = {})
		@name = attributes[:name]
	end

    def salut
        "#{@name} il pue "
    end
end
